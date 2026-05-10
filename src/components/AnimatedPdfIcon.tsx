export const AnimatedPDFIcon = () => (
    <div className="relative flex items-center justify-center w-28 h-32 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
            <div
                className="animate-ripple absolute w-24 h-28 rounded-full"
                style={{ border: "2px solid rgba(249,115,22,0.45)" }}
            />
            <div
                className="animate-ripple-delayed absolute w-24 h-28 rounded-full"
                style={{ border: "2px solid rgba(249,115,22,0.25)" }}
            />
        </div>
        <div className="animate-float relative z-10">
            <svg width="62" height="74" viewBox="0 0 62 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="6" width="50" height="64" rx="6" fill="#7EC8E3" opacity="0.35" />
                <rect x="4" y="2" width="50" height="64" rx="6" fill="white" />
                <path d="M42 2 L54 14 L42 14 Z" fill="#e5e7eb" />
                <rect x="12" y="22" width="28" height="3" rx="1.5" fill="#7EC8E3" opacity="0.6" />
                <rect x="12" y="29" width="22" height="3" rx="1.5" fill="#e5e7eb" />
                <rect x="12" y="36" width="26" height="3" rx="1.5" fill="#e5e7eb" />
                <rect x="12" y="43" width="18" height="3" rx="1.5" fill="#7EC8E3" opacity="0.4" />
                <rect x="10" y="52" width="38" height="8" rx="4" fill="#F97316" />
                <rect x="16" y="55" width="26" height="2" rx="1" fill="white" opacity="0.8" />
            </svg>
        </div>
    </div>
);

export default AnimatedPDFIcon;