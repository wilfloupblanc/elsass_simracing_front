import {CheckIcon, MinusIcon} from "@phosphor-icons/react";
import {useNavigate} from "react-router";
import {
    useChangePlanMutation,
    useGetMySubscriptionQuery,
    useSubscribeMutation
} from "../../store/ApiSlice/subscriptionApiSlice.js";
import {useGetAllPlansQuery} from "../../store/ApiSlice/planApiSlice.js";
import {useAuthenticated} from "../../hooks/useAuthenticated.js";
import {useGetAllSessionsQuery} from "../../store/ApiSlice/sessionApiSlice.js";
import React from "react"

import "./Subscriptions.scss"
import {Alert} from "../../components/Alert/index.jsx";
import {useDispatch} from "react-redux";
import {setIsModalOpen} from "../../store/slice/authSlice.js";


const PlanButton = ({ plan, label, isAlreadyMember, currentPlan, isLoading, isChangingPlan, onSubscribe, onChangePlan, isAuth, onOpenLogin }) => {
    if (isAlreadyMember && currentPlan !== plan) {
        return (
            <Alert openBtnText={`Passer en ${plan}`} btnClassName="text-secondary">
                {({ onClose }) => (
                    <>
                        <h3>Changer de plan</h3>
                        <p>Passer de <strong>{currentPlan}</strong> à <strong>{plan}</strong> ?</p>
                        <p>Le changement sera <strong>effectif à partir du prochain renouvellement</strong>. Vous conservez votre plan actuel jusqu'à la fin de la période en cours.</p>
                        <div>
                            <button className="text-secondary bg-third" onClick={onClose}>Annuler</button>
                            <button
                                className="text-secondary bg-primary"
                                disabled={isChangingPlan}
                                onClick={async () => {
                                    await onChangePlan(plan)
                                    onClose()
                                }}
                            >
                                {isChangingPlan ? "Chargement..." : "Confirmer"}
                            </button>
                        </div>
                    </>
                )}
            </Alert>
        )
    }

    return (
        <button
            onClick={() => isAuth ? onSubscribe(plan) : onOpenLogin()}
            disabled={isLoading || isChangingPlan || currentPlan === plan}
            className="text-secondary"
        >
            {currentPlan === plan ? "✓ Plan actuel" : label}
        </button>
    )
}

export const Subscriptions = () => {

    const dispatch = useDispatch()
    const {isAuth, user} = useAuthenticated()
    const [subscribe, {isLoading}] = useSubscribeMutation()
    const {data: plansData} = useGetAllPlansQuery()
    const {data: sessionsData} = useGetAllSessionsQuery()
    const sessions = sessionsData?.sessions ?? []
    const navigate = useNavigate()
    const [changePlan, {isLoading: isChangingPlan}] = useChangePlanMutation()
    const isAlreadyMember = user?.is_member === 1
    const { data: mySubscription } = useGetMySubscriptionQuery(undefined, { skip: !isAuth || !isAlreadyMember })
    const currentPlan = mySubscription?.subscription?.plan
    const freeSession = sessions.find(s => s.id === 1);

    const plans = ["STARTER", "PLUS", "ULTRA"]
    const prices = plans.reduce((acc, plan) => {
        const found = plansData?.plans?.find(p => p.plan === plan)
        acc[plan] = found?.price ?? null
        return acc
    }, {})

    const handleSubscribe = async (plan) => {
        if (!isAuth) { navigate("/"); return }

        if (isAlreadyMember) {
            if (currentPlan === plan) return
            await changePlan(plan).unwrap()
            return
        }

        const result = await subscribe(plan).unwrap()
        window.location.assign(result.url)
    }

    const planButtonProps = {
        isAlreadyMember,
        currentPlan,
        isLoading,
        isChangingPlan,
        onSubscribe: handleSubscribe,
        onChangePlan: changePlan,
        isAuth,
        onOpenLogin: () => dispatch(setIsModalOpen({ isModalOpen: true }))
    }

    return (
        <main className="subscriptions">
            <section className="subscriptions__container">

                <div className="subscriptions__container--title">
                    <h1>CLUB SIMRACING</h1>
                    <p>Rejoignez notre club et</p>
                    <p>Bénéficiez d'avantages exclusifs</p>
                </div>

                <article className="subscriptions__container--club">
                    <h2>Pack STARTER</h2>
                    <h3><span className="text-primary">{prices.STARTER ? `${prices.STARTER.toFixed(2)}€` : "—"}</span> /mois</h3>

                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>2x 15 minutes OFFERTES</span> chaque mois <span className="value">d'une valeur de {freeSession ? (freeSession.price_normal * 2).toFixed(2) : '...'}€</span></p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>Tarifs réduits</span> au bar</p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>Accès aux soirées privées et événements spécial membre</span></p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p>Accès au championnat annuel <span>spécial membre</span></p>
                    </div>
                    <div className="none">
                        <span className="icon-wrapper"><MinusIcon size={32} /></span>
                        <p>Accès aux tarifs réduits sur toutes les sessions</p>
                    </div>

                    <PlanButton plan="STARTER" label="Choisir STARTER" {...planButtonProps} />
                </article>

                <article className="subscriptions__container--club popular">
                    <div className="popular__badge">
                        <p>Le plus populaire</p>
                    </div>
                    <h2>Pack PLUS</h2>
                    <h3><span className="text-primary">{prices.PLUS ? `${prices.PLUS.toFixed(2)}€` : "—"}</span> /mois</h3>

                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>4x 15 minutes OFFERTES</span> chaque mois <span className="value">d'une valeur de {freeSession ? (freeSession.price_normal * 4).toFixed(2) : '...'}€</span></p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>Tarifs réduits</span> sur toutes les sessions</p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>Tarifs réduits</span> au bar</p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>Accès aux soirées privées et événements spécial membre</span></p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p>Accès au championnat annuel <span>spécial membre</span></p>
                    </div>

                    <PlanButton plan="PLUS" label="Choisir PLUS" {...planButtonProps} />
                </article>

                <article className="subscriptions__container--club">
                    <h2>Pack ULTRA</h2>
                    <h3><span className="text-primary">{prices.ULTRA ? `${prices.ULTRA.toFixed(2)}€` : "—"}</span> /mois</h3>

                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>8x 15 minutes OFFERTES</span> chaque mois <span className="value">d'une valeur de {freeSession ? (freeSession.price_normal * 8).toFixed(2) : '...'}€</span></p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>Tarifs réduits</span> sur toutes les sessions</p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>Tarifs réduits</span> au bar</p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p><span>Accès aux soirées privées et événements spécial membre</span></p>
                    </div>
                    <div>
                        <span className="icon-wrapper"><CheckIcon size={32} /></span>
                        <p>Accès au championnat annuel <span>spécial membre</span></p>
                    </div>

                    <PlanButton plan="ULTRA" label="Choisir ULTRA" {...planButtonProps} />
                </article>

                <article className="subscriptions__container--member-prices">
                    <h2 className="text-primary">Tarifs Membres</h2>
                    <div className="grid-table">
                        <span>Durée</span>
                        <span>Tarif normal</span>
                        <span>Tarif membre</span>

                        {sessions.filter(session => session.id !== 5).map(session => (
                            <React.Fragment key={session.id}>
                                <span>{session.duration_minutes} minutes</span>
                                <span>{session.price_normal.toFixed(2)}€</span>
                                <span>{session.price_member.toFixed(2)}€</span>
                            </React.Fragment>
                        ))}
                    </div>
                </article>

                <article className="subscriptions__container--note">
                    <p><span>Note :</span> Les 15 minutes offertes ne sont pas cumulables d'un mois à l'autre. Une fois utilisées, vous pouvez continuer à rouler aux tarifs membres préférentiels sur toutes les durées.</p>
                </article>

                <div className="conditions">
                    <p>Paiement sécurisé via Stripe - Annulation à tout moment - Sans engagement</p>
                </div>
            </section>
        </main>
    )
}