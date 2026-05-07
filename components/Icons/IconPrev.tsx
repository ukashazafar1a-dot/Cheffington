type ClassProps = {
    class?: string;
};

const IconPrev = ({ class: className }: ClassProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 ${className}`}
            viewBox="0 0 24 24"
        >
            <polyline
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                points="9 6 15 12 9 18"
                transform="matrix(-1 0 0 1 24 0)"
            />
        </svg>
    );
};

export default IconPrev;