import { Image } from "react-bootstrap";

const Avatar = ({ src, size = 40, className = "" }) => {
  return (
    <Image
      src={src}
      roundedCircle
      width={size}
      height={size}
      className={`border ${className}`}
      style={{ objectFit: "cover" }}
    />
  );
};

export default Avatar;