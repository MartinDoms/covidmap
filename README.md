A Next.JS website with a map display and a data munger for preparing the data. The munger assumes that you have the [Johns Hopkins University data set]
(https://github.com/CSSEGISandData/COVID-19) at `~/src/covid19-data`.

## Getting Started

To run the data munger,
```
covidmap/src/data-munger/ $ dotnet run
```

The cleaned data will end up in `covidmap/src/website/data/data.json`.

To run the website,
```
$ yarn dev
```

You can deploy this the same as any next.js app, read their documentation for more.