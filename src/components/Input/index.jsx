import "./Input.scss"

export const Input = ({inputName, value, inputType, labelText, inputComplete, onChange, suffix, ...props}) => {
    return (
        <>
            <label htmlFor={inputName} className="text-secondary">
                {labelText}
            </label>
            <div className="input-wrapper">
                <input
                    id={inputName}
                    name={inputName}
                    value={value}
                    type={inputType}
                    autoComplete={inputComplete}
                    onChange={onChange}
                    {...props}
                />
                {suffix && <span className="input-suffix">{suffix}</span>}
            </div>
        </>
    )
}