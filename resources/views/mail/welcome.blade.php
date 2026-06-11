@component('mail::message')
# Bienvenue dans le peloton, {{ $user->name }} ! 🚴‍♂️

Nous sommes ravis de t'accueillir sur **{{ config('app.name') }}**. Que tu sois adepte du vélotaf, mordu de bitume ou
fan de sentiers
boueux, l'app est prête à enregistrer tes exploits.

@component('mail::panel')
"La vie, c'est comme la bicyclette, il faut avancer pour ne pas perdre l'équilibre."
*— Albert Einstein*
@endcomponent

### Tes premières étapes :
* **Profil :** Complète tes infos.
* **Matériel :** Ajoute ton vélo pour suivre l'usure de tes composants.
* **Sorties :** Enregistre tes balades pour analyser tes performances.
* **Défis :** Participe à des défis pour rester motivé et t'amuser !

@component('mail::button', ['url' => $url, 'color' => 'success'])
C'est parti, on roule !
@endcomponent

Besoin d'aide pour configurer ton application ? Réponds simplement à ce mail, notre équipe est là pour ça.

Bonne route,<br>
L'équipe {{ config('app.name') }}
@endcomponent