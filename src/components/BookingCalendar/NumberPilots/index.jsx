import {GreaterThanIcon, LessThanIcon} from "@phosphor-icons/react";

import "./NumberPilots.scss"

export const NumberPilots = ({player, setPlayer, minPilots = 1, maxPilots = 6}) => {
    const isMaxPlayer = player === maxPilots;
    const isMinPlayer = player === minPilots;

    return (
        <div className="numberPilots bg-third">
            <h3>Nombre de pilotes</h3>
            <div className="numberPilots__buttons">
                <button
                    onClick={() => setPlayer(player - 1)}
                    disabled={isMinPlayer}
                    className={`more ${isMinPlayer ? "more--disabled" : ""}`}
                    aria-label="less pilots button"
                >
                    <LessThanIcon size={30} />
                </button>
                <span>{player}</span>
                <button
                    onClick={() => setPlayer(player + 1)}
                    disabled={isMaxPlayer}
                    className={`more ${isMaxPlayer ? "more--disabled" : ""}`}
                    aria-label="more pilots button"
                >
                    <GreaterThanIcon size={30} />
                </button>
            </div>
        </div>
    )
}