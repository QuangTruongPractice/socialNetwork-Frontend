import { useState } from "react";
import MediaLightbox from "./MediaLightbox";

export default function PostMediaGrid({ medias, fallbackImage, fallbackVideo, onMediaClick }) {
    const [showLightbox, setShowLightbox] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Normalize media: ensure all items have a type (default IMAGE) and url
    const allMedia = medias && medias.length > 0
        ? medias.map(m => ({ ...m, type: m.type || "IMAGE" }))
        : (fallbackVideo ? [{ url: fallbackVideo, type: "VIDEO" }] : (fallbackImage ? [{ url: fallbackImage, type: "IMAGE" }] : []));

    if (allMedia.length === 0) return null;

    const openLightbox = (e, idx) => {
        if (e) e.stopPropagation();
        if (onMediaClick) {
            onMediaClick(idx);
            return;
        }
        setSelectedIndex(idx);
        setShowLightbox(true);
    };

    const renderMedia = (m, idx, customStyle = {}) => {
        if (m.type === "IMAGE") {
            return (
                <img
                    src={m.url}
                    alt={`post-${idx}`}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", cursor: "pointer", ...customStyle }}
                    onClick={(e) => openLightbox(e, idx)}
                />
            );
        }
        return (
            <div className="w-100 h-100 position-relative" style={{ cursor: "pointer" }} onClick={(e) => openLightbox(e, idx)}>
                <video src={m.url} className="w-100 h-100" style={{ objectFit: "cover", ...customStyle }} />
                <div className="position-absolute top-50 start-50 translate-middle text-white" style={{ pointerEvents: "none" }}>
                    <i className="bi bi-play-circle-fill" style={{ fontSize: "2rem", opacity: 0.8 }}></i>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-3">
            {/* Single Media: Centered & Natural */}
            {allMedia.length === 1 && (
                <div
                    className="overflow-hidden rounded border d-flex justify-content-center align-items-center bg-white"
                    style={{ cursor: "pointer", height: "400px" }}
                    onClick={(e) => openLightbox(e, 0)}
                >
                    {allMedia[0].type === "IMAGE" ? (
                        <img
                            src={allMedia[0].url}
                            alt="post-single"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain"
                            }}
                        />
                    ) : (
                        <video
                            src={allMedia[0].url}
                            controls
                            className="w-100 h-100"
                            style={{ objectFit: "contain" }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </div>
            )}

            {/* Double Media: Taller 50/50 Side-by-Side */}
            {allMedia.length === 2 && (
                <div className="d-flex gap-2" style={{ height: "450px" }}>
                    {allMedia.map((m, idx) => (
                        <div key={idx} className="flex-grow-1 overflow-hidden rounded border bg-light shadow-sm">
                            {renderMedia(m, idx)}
                        </div>
                    ))}
                </div>
            )}

            {/* Triple Media: 3 Columns Side-by-Side */}
            {allMedia.length === 3 && (
                <div className="d-flex gap-2" style={{ height: "300px" }}>
                    {allMedia.map((m, idx) => (
                        <div key={idx} className="flex-grow-1 overflow-hidden rounded border bg-light shadow-sm" style={{ width: "33.33%" }}>
                            {renderMedia(m, idx)}
                        </div>
                    ))}
                </div>
            )}

            {/* 4+ Media: Grid with Overflow */}
            {allMedia.length >= 4 && (
                <div className="d-grid gap-2" style={{ gridTemplateColumns: "2fr 1fr", height: "400px" }}>
                    {/* Left Big Slot */}
                    <div className="overflow-hidden rounded border bg-light">
                        {renderMedia(allMedia[0], 0)}
                    </div>
                    {/* Right Column with 2 Slots */}
                    <div className="d-grid gap-2" style={{ gridTemplateRows: "1fr 1fr" }}>
                        <div className="overflow-hidden rounded border bg-light">
                            {renderMedia(allMedia[1], 1)}
                        </div>
                        <div className="overflow-hidden rounded border bg-light position-relative">
                            {renderMedia(allMedia[2], 2)}
                            {allMedia.length > 3 && (
                                <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white"
                                    style={{ backgroundColor: "rgba(0,0,0,0.5)", fontSize: "1.5rem", fontWeight: "bold", cursor: "pointer" }}
                                    onClick={(e) => openLightbox(e, 2)}
                                >
                                    +{allMedia.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <MediaLightbox
                show={showLightbox}
                onHide={() => setShowLightbox(false)}
                medias={allMedia}
                initialIndex={selectedIndex}
            />
        </div>
    );
}
