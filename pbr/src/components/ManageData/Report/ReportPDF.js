import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
  },
  section: {
    flexGrow: 1,
    alignItems: "center",
  },
  table: {
    width: 400,
    fontSize: 10,
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "column",
    alignItems: "stretch",
    alignContent: "center",
  },
  row: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row",
    alignItems: "stretch",
    alignContent: "center",
  },
  title: {
    borderStyle: "none",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    textAlign: "center",
    fontSize: "20px"
  },
  info: {
    borderStyle: "none",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    textAlign: "left",
  },
  head: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000000",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    textAlign: 'center',
    fontStyle: "normal",
    fontWeight: "bold"
  },
  cell: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000000",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    textAlign: "center",
  }
});

export default function ReportPDF(props) {
  const { payload } = props;
  console.log(payload)
  return (
    <Document>
      {payload.map((item) => (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.table}>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.title]}>{"Diagnostic Report"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"Sample ID:"}</Text>
                <Text style={[styles.info]}>{item.sample.id}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"Timestamp:"}</Text>
                <Text style={[styles.info]}>{item.sample.timestamp_added}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"Organization:"}</Text>
                <Text style={[styles.info]}>{item.sample.flock.source.organization.name}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"Source:"}</Text>
                <Text style={[styles.info]}>{item.sample.flock.source.name}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"Flock:"}</Text>
                <Text style={[styles.info]}>{item.sample.flock.name}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"Species:"}</Text>
                <Text style={[styles.info]}>{item.sample.flock.species}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"Strain:"}</Text>
                <Text style={[styles.info]}>{item.sample.flock.strain}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"Gender:"}</Text>
                <Text style={[styles.info]}>{item.sample.flock.gender}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"Age Group:"}</Text>
                <Text style={[styles.info]}>{item.filters.age_group}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"Method:"}</Text>
                <Text style={[styles.info]}>{item.filters.method}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.head]}>Analyte</Text>
                <Text style={[styles.head]}>Measurement</Text>
                <Text style={[styles.head]}>Lower Bound</Text>
                <Text style={[styles.head]}>Upper Bound</Text>
              </View>

              {item.data.map((row) => (
              <View style={[styles.row]}>
                <Text style={[styles.cell]}>{"\n " + row.analyte_abbreviation}</Text>
                <Text style={[styles.cell]}>{"\n " + row.measurement_value}</Text>
                <Text style={[styles.cell]}>{"\n " + row.lower_bound}</Text>
                <Text style={[styles.cell]}>{"\n " + row.upper_bound}</Text>
              </View>
              ))}

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"1. CK values above 2500 UL should be interpreted with caution. These values may be outside the expected normal range."}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"\n"}</Text>
              </View>

              <View style={[styles.row]}>
                <Text style={[styles.info]}>{"2. K values above 7 are not compatible with life. High values may be an artifact, due to high CK values. Recommend to check with a different unit or chemistry"}</Text>
              </View>

            </View>
          </View>
        </Page>
      ))}
    </Document>
  )
};