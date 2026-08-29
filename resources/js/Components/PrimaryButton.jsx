export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
            className={
                `inline-flex items-center rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
