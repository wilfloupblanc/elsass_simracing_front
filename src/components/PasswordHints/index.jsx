import { useMemo } from "react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import './PasswordHints.scss'

const RULES = [
    { key: "length",  label: "8 caractères minimum", regex: /.{8,}/  },
    { key: "upper",   label: "1 lettre majuscule",    regex: /[A-Z]/ },
    { key: "number",  label: "1 chiffre",             regex: /[0-9]/ },
    { key: "special", label: "1 caractère spécial",   regex: /[^A-Za-z0-9]/ },
]

export const PasswordHints = ({ password }) => {
    const checks = useMemo(() =>
            RULES.map(rule => ({ ...rule, valid: rule.regex.test(password) }))
        , [password])

    if (!password) return null

    return (
        <ul className="password-hints">
            {checks.map(({ key, label, valid }) => (
                <li key={key} className={`password-hints__item ${valid ? "password-hints__item--valid" : ""}`}>
                    {valid
                        ? <CheckCircleIcon size={14} weight="fill" />
                        : <XCircleIcon size={14} weight="fill" />
                    }
                    <span>{label}</span>
                </li>
            ))}
        </ul>
    )
}