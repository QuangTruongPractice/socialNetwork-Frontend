import { REACTIONS } from "../../configs/LoadData";

export default function ReactionButton({ onSelect }) {
  return (
    <div
      className="position-absolute bg-white border rounded shadow-sm p-2 d-flex gap-2"
      style={{ top: "-50px", right: "0", zIndex: 999 }}
    >
      {REACTIONS.map((r) => (
        <span
          key={r.type}
          style={{ cursor: "pointer", fontSize: "20px" }}
          onClick={() => onSelect(r.type)}
          title={r.type}
        >
          {r.icon}
        </span>
      ))}
    </div>
  );
}
