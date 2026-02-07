import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function MediaLightbox({ show, onHide, medias, initialIndex = 0 }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, show]);

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % medias.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + medias.length) % medias.length);
    };

    const currentMedia = medias[currentIndex];

    if (!currentMedia) return null;

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            fullscreen
            contentClassName="bg-black border-0 overflow-hidden"
        >
            <Modal.Header
                closeButton
                closeVariant="white"
                className="border-0 position-absolute w-100 z-index-1"
                style={{ zIndex: 1060 }}
            ></Modal.Header>
            <Modal.Body className="p-0 d-flex align-items-center justify-content-center bg-black position-relative" style={{ height: "100vh" }}>
                {medias.length > 1 && (
                    <Button
                        variant="link"
                        className="position-absolute start-0 text-white p-3 z-index-1"
                        style={{ fontSize: "2rem", textDecoration: "none", zIndex: 1060 }}
                        onClick={handlePrev}
                    >
                        &#8249;
                    </Button>
                )}

                <div className="w-100 h-100 d-flex align-items-center justify-content-center px-5">
                    {currentMedia.type === "IMAGE" || !currentMedia.type ? (
                        <img
                            src={currentMedia.url}
                            alt={`gallery-${currentIndex}`}
                            style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain" }}
                        />
                    ) : (
                        <video
                            src={currentMedia.url}
                            controls
                            autoPlay
                            className="w-100"
                            style={{ maxHeight: "90vh" }}
                        />
                    )}
                </div>

                {medias.length > 1 && (
                    <Button
                        variant="link"
                        className="position-absolute end-0 text-white p-3 z-index-1"
                        style={{ fontSize: "2rem", textDecoration: "none", zIndex: 1060 }}
                        onClick={handleNext}
                    >
                        &#8250;
                    </Button>
                )}

                <div className="position-absolute bottom-0 w-100 text-center text-white pb-3" style={{ zIndex: 1060 }}>
                    <small>
                        {currentIndex + 1} / {medias.length}
                    </small>
                </div>
            </Modal.Body>
        </Modal>
    );
}
