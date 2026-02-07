import { Form } from "react-bootstrap";

export default function UploadImage({ files, setFiles }) {
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      // Create previews for new files
      const newFilesWithPreview = selectedFiles.map(file => ({
        file: file,
        url: URL.createObjectURL(file),
        type: file.type
      }));

      setFiles(prev => [...prev, ...newFilesWithPreview]);

      // Reset input value to allow selecting the same file again if deleted
      e.target.value = null;
    }
  };

  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      // Revoke URL to prevent memory leaks
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <Form.Group className="mt-3">
      <Form.Label>Ảnh/Video (Có thể chọn nhiều ảnh hoặc 1 video)</Form.Label>
      <Form.Control
        type="file"
        name="media"
        accept="image/*,video/*"
        onChange={handleFileChange}
        multiple
      />
      {files && files.length > 0 && (
        <div className="mt-3 d-flex flex-wrap gap-2 justify-content-center border rounded p-2 bg-light">
          {files.map((p, index) => (
            <div key={index} className="preview-item border rounded overflow-hidden" style={{ width: "120px", height: "120px", position: "relative" }}>
              <button
                type="button"
                className="btn btn-danger btn-sm p-0 d-flex align-items-center justify-content-center"
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  zIndex: 2,
                  opacity: 0.8
                }}
                onClick={() => removeFile(index)}
              >
                &times;
              </button>
              {p.type.startsWith("video") ? (
                <video src={p.url} className="w-100 h-100" style={{ objectFit: "cover" }} />
              ) : (
                <img src={p.url} alt={`preview-${index}`} className="w-100 h-100" style={{ objectFit: "cover" }} />
              )}
            </div>
          ))}
        </div>
      )}
    </Form.Group>
  );
}
