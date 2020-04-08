var metrics = [
    {
      name: 'Current cases (confirmed - recovered)',
      calc: m => m.ConfirmedCases - m.Recovered
    },
    {
      name: 'Deaths',
      calc: m => m.Deaths
    },
    {
      name: 'Confirmed cases',
      calc: m => m.ConfirmedCases
    },
    {
      name: 'Recovered',
      calc: m => m.Recovered
    },
];

export { metrics };