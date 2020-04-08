using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using CsvHelper;
using CsvHelper.Configuration.Attributes;
using static System.Environment;
using Newtonsoft.Json;

namespace c19data_munge
{
    class Program
    {
        static void Main(string[] args)
        {
            var dataDir = Path.Combine(
                Environment.GetFolderPath(SpecialFolder.UserProfile, SpecialFolderOption.DoNotVerify), 
                "src",
                "c19data",
                "csse_covid_19_data",
                "csse_covid_19_daily_reports"
            );
            var files = Directory.GetFiles(dataDir, "*.csv");
            var result = new Dictionary<DateTime, List<DataPoint>>();

            foreach (var file in files) {
                Console.WriteLine($"Processing {file}");

                using (var reader = new StreamReader(file))
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture)) {
                    csv.Configuration.MissingFieldFound = null;
                    csv.Read();
                    csv.ReadHeader();

                    var dataPoints = new List<DataPoint>();
                    while (csv.Read()) {
                        var state = csv.GetField("Province/State") ?? csv.GetField("Province_State");
                        var country = csv.GetField("Country/Region") ?? csv.GetField("Country_Region");
                        country = CountryMap(country);
                        var updated = DateTime.ParseExact(
                            csv.GetField("Last Update") ?? csv.GetField("Last_Update"),
                            new[] {"M/d/yyyy H:mm", "M/d/y H:mm", "yyyy-MM-ddTHH:mm:ss", "yyyy-MM-dd HH:mm:ss"},
                            CultureInfo.InvariantCulture
                        );
                        var confirmed = 0;
                        int.TryParse(csv.GetField("Confirmed"), out confirmed);
                        var deaths = 0;
                        int.TryParse(csv.GetField("Deaths"), out deaths);
                        var recovered = 0;
                        int.TryParse(csv.GetField("Recovered"), out recovered);

                        var dataPoint = new DataPoint(
                            country,
                            updated,
                            confirmed,
                            deaths,
                            recovered
                        );
                        dataPoints.Add(dataPoint);
                    }

                    var list = dataPoints
                        .GroupBy(d => d.Country)
                        .Select(kvp => new DataPoint(
                                kvp.Key,
                                kvp.First().LastUpdate,
                                kvp.Sum(k => k.ConfirmedCases),
                                kvp.Sum(k => k.Deaths),
                                kvp.Sum(k => k.Recovered)   
                            )
                        )
                        .ToList();

                    result.Add(DateTimeFromFileName(file), list);
                }
            }

            var outputFile = Path.Combine(
                Environment.GetFolderPath(SpecialFolder.UserProfile, SpecialFolderOption.DoNotVerify), 
                "src",
                "covidmap",
                "src",
                "website",
                "data",
                "data.json"
            );

            File.WriteAllText(outputFile, JsonConvert.SerializeObject(result));

        }

        static DateTime DateTimeFromFileName(string path) {
            var file = Path.GetFileName(path);
            var datePart = file.Substring(0, file.IndexOf("."));

            return DateTime.ParseExact(
                datePart,
                "mm-dd-yyyy",
                CultureInfo.InvariantCulture
            );
        }

        static Dictionary<string,string> countryMap = new Dictionary<string,string> {
            {"Mainland China", "China"}
        };
        static string CountryMap(string country) {
            if (countryMap.ContainsKey(country)) return countryMap[country];
            return country;
        }
    }

    class DataPoint {
        [Name("Country/Region")]
        public string Country { get; set; }
        [Name("Last Update")]
        public DateTime LastUpdate { get; set; }
        [Name("Confirmed")]
        [Default(0)]
        public int ConfirmedCases { get; set; }
        [Default(0)]
        public int Deaths { get; set; }
        [Default(0)]
        public int Recovered { get; set; }

        public DataPoint(
            string country,
            DateTime lastUpdate,
            int confirmedCases,
            int deaths,
            int recovered
        ) {
            Country = country;
            LastUpdate = lastUpdate;
            ConfirmedCases = confirmedCases;
            Deaths = deaths;
            Recovered = recovered;
        }
    }
}
