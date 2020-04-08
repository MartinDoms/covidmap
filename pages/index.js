import React from 'react';
import Head from 'next/head';
import { MapContainer } from '../components/map-container';
import data from '../data/data.json';
import { metrics } from '../data/metrics';

function Home({data, minMaxes, properties}) {

  return (
    <div className="container">
      <Head>
        <title>Covid evolving map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <main>
        <MapContainer data={data} minMaxes={minMaxes} />
      </main>
  
      <style jsx>{`
        .container {
          padding: 2.5em;
        }
      `}</style>
  
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }
  
        * {
          box-sizing: border-box;
        }
        
      `}</style>
    </div>
  )
}

export async function getStaticProps() {
  var dates = Object.keys(data);
  var dataAsArray = dates.map(function(key) {
    return data[key];
  });


  var minMaxes = metrics.reduce((acc, p) => {
    acc[p.name] = { min: 999999, max: 0};
    return acc;
  }, {});
  
  for (var i = 0; i < dataAsArray.length; i++) {
    var dateData = dataAsArray[i];
    for (var j = 0; j < dateData.length; j++) {
      var dataPoint = dateData[j];
      for (var k = 0; k < metrics.length; k++) {
        
        var metric = metrics[k];
        var value = metric.calc(dataPoint);

        if (value < minMaxes[metric.name].min) minMaxes[metric.name].min = value;
        if (value > minMaxes[metric.name].max) minMaxes[metric.name].max = value;
      }
    }
  }

  return  {props: { data, minMaxes } };
}

export default Home
