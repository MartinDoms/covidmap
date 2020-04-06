import React from 'react';
import Head from 'next/head';
import { MapContainer } from '../components/map-container';
import data from '../data/data.json';

function Home({data, minMaxes, properties}) {

  return (
    <div className="container">
      <Head>
        <title>Covid evolving map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <main>
        <MapContainer data={data} minMaxes={minMaxes} properties={properties} />
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
  var properties = ['Deaths', 'ConfirmedCases', 'Recovered'];
  var minMaxes = properties.reduce((acc, p) => {
    acc[p] = { min: 999999, max: 0};
    return acc;
  }, {});
  
  for (var i = 0; i < dataAsArray.length; i++) {
    var dateData = dataAsArray[i];
    for (var j = 0; j < dateData.length; j++) {
      for (var k = 0; k < properties.length; k++) {
        var prop = properties[k];
        var value = dateData[j][prop];
        if (value < minMaxes[prop].min) minMaxes[prop].min = value;
        if (value > minMaxes[prop].max) minMaxes[prop].max = value;
      }
    }
  }

  console.log(dates);
  return  {props: { data, minMaxes, properties } };
}

export default Home
