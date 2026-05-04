const POLITIQUE_COOKIES_CONTENT = `
<h1>Politique de Cookies</h1>
<p>Dernière mise à jour : 30/08/2025</p>

<h2>1. Qu'est-ce qu'un cookie ?</h2>
<p>
  Un cookie est un petit fichier texte déposé sur votre navigateur lors de la visite d'un site.
  Il permet au site de mémoriser des informations sur votre visite pour améliorer votre expérience
  et assurer le bon fonctionnement des services proposés.
</p>

<h2>2. Cookies utilisés sur ce site</h2>

<h3>Cookies strictement nécessaires</h3>
<p>Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés.</p>
<ul>
  <li>
    <strong>Token d'authentification (JWT)</strong><br>
    Finalité : maintenir votre session de connexion<br>
    Durée : durée de la session
  </li>
  <li>
    <strong>Panier (redux-persist)</strong><br>
    Finalité : conserver le contenu de votre panier entre deux visites<br>
    Durée : persistant (localStorage)
  </li>
  <li>
    <strong>Consentement cookies</strong><br>
    Finalité : mémoriser votre choix concernant les cookies<br>
    Durée : 12 mois
  </li>
</ul>

<h3>Cookies de paiement (Stripe)</h3>
<p>
  Lors du paiement, Stripe dépose ses propres cookies nécessaires à la sécurisation
  de la transaction. Ces cookies sont soumis à la
  <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer">
    politique de confidentialité de Stripe
  </a>.
</p>

<h3>Cookies analytiques et marketing</h3>
<p>
  Aucun cookie analytique ou publicitaire n'est déposé sans votre consentement explicite.
  Si vous acceptez via notre bannière, nous pourrons utiliser des outils de mesure d'audience
  pour améliorer nos services.
</p>

<h2>3. Gestion de vos préférences</h2>
<p>
  Lors de votre première visite, une bannière vous permet d'accepter ou de refuser les cookies
  non essentiels. Vous pouvez modifier votre choix à tout moment en vidant les données
  de votre navigateur ou en nous contactant à : elsass.simracing@gmail.com
</p>
<p>Vous pouvez également gérer les cookies directement depuis votre navigateur :</p>
<ul>
  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
  <li><a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
  <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
  <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
</ul>

<h2>4. Contact</h2>
<p>
  Pour toute question relative à l'utilisation des cookies sur ce site, contactez-nous à :<br>
  elsass.simracing@gmail.com
</p>
`;

export default POLITIQUE_COOKIES_CONTENT;