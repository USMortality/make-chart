# README
Generate a scatter chart:
```
node dist/make-chart.js \
  --infile data.csv \
  --outfile chart.png \
  --title 'Pfizer COVID-19 Vaccine Efficacy (VE), 6 - 23 Months of Age' \
  --subtitle 'First COVID-19 Occurrence Any Time After Dose 1, Blinded Follow-Up Period,Participants 6 - 23 Months of Age, All - Available Efficacy Population, Study C4591007' \
  --xtitle 'Vaccine Efficacy' \
  --ytitle 'Efficacy Endpoint' \
  --labels '["After Dose 1","Dose 1 to before Dose 2","Dose 2 to <7d after Dose 2","27d after Dose 2 to before Dose 3","27d after Dose 3"]'
```