interface IDocuchatLogoProps {
    showText?: boolean;
}

export const DocuchatLogo = ({ showText = true }: IDocuchatLogoProps) => (
    <div className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="20" height="24" rx="3" fill="#F97316" />
            <rect x="7" y="8" width="14" height="2" rx="1" fill="white" opacity="0.8" />
            <rect x="7" y="12" width="10" height="2" rx="1" fill="white" opacity="0.8" />
            <rect x="7" y="16" width="12" height="2" rx="1" fill="white" opacity="0.8" />
        </svg>
        {showText && (
            <span style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.03em", color: "#111827" }}>
                Docuchat
            </span>
        )}
    </div>
);

export default DocuchatLogo;