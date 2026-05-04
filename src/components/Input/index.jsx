
export const Input = ({inputName, value, inputType, labelText, inputComplete, onChange, ...props}) => {
    return (
        <>
            <label htmlFor={inputName} className="text-secondary">
                {labelText}
            </label>
            <input
                id={inputName}
                name={inputName}
                value={value}
                type={inputType}
                autoComplete={inputComplete}
                onChange={onChange}
                {...props}
            />
        </>
    )
}