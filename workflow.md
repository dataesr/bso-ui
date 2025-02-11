Workflow to submit a new FOSM local variation

1. To ask for a new FOSM local variation or an updated version, a user will submit a new file through the dedicated page / form https://barometredelascienceouverte.esr.gouv.fr/declinaisons/comment-realiser-bso-local?expanded=1.
2. This form automatically checks that the submitted file meets the expected format. If not, an error is displayed to the user and the form can not be submitted. If yes, the form is submitted.
3. The submitted form send an email to bso@recherche.gouv.fr with subject "[bso] Demande d'un nouveau BSO Local", all the infos are in the emil and the file is attached.
4. If the structure is not listed here : https://github.com/dataesr/bso-ui/blob/staging/src/config/locals.json, add it and check the commentsName, the ror and the paysage. Then deploy in production by running `npm run deploy --level=[patch|minor|major]`.
5. In any case, upload the CSV file to OVH / Object Storage / container 'bso-local'.
6. Once done, answer the email and add a trigger
```
Bonjour,

Merci. Nous vous tiendrons au courant dès que les données seront ingérées, probablement la semaine prochaine.
 
Bonne journée,
```
7. The next Friday, we run the FOSM "Nouvel ET" like explained here https://github.com/dataesr/disd-pipelines/blob/main/bso2/bso-publications.ipynb. Follow the progress through the dedicated dashboard.
8. The next Monday, if all the jobs are finished and succeeded, move the 'bso-publications-staging' ES alias on the newly created ES index. Check on bso.staging.dataesr.ovh that everything is ok. If so, move the 'bso-publications' ES alias on the newly created ES index. Delete the n-2 `bso-publications-XXXXXXXX` ES index, in order to keep the current one and the previous one only.
9. Then use the node script here https://github.com/dataesr/bso-ui/blob/staging/bso-local-variation-validation.mjs to warn users that there FOSM local variation is ready. You can filter on trigger on your mail box. Do not forget to remove the trigger on dedicated emails.