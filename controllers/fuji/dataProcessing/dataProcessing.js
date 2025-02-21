export const parseDE = (de) => parseFloat(de);

export const prepareAniloxScatterData = (data) => {

  const validItems = data.filter((item) => parseDE(item.de) <= 4);

  const preparedData = validItems.map((item) => {
    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleDateString("en-GB"); // Format to DD/MM/YYYY

    return {
      anilox: item.anilox,
      de: parseFloat(item.de),
      date: formattedDate, 
      rawDate: dateObj,
      xValue: dateObj.getTime(),
    };
  });

  // Sort data by rawDate
  preparedData.sort((a, b) => a.rawDate - b.rawDate);

  // data by anilox type
  const groupedByAnilox = preparedData.reduce((acc, item) => {
    if (!acc[item.anilox]) {
      acc[item.anilox] = [];
    }
    acc[item.anilox].push(item);
    return acc;
  }, {});

  // trend line for each anilox type
  Object.keys(groupedByAnilox).forEach((aniloxType) => {
    const groupData = groupedByAnilox[aniloxType];

    const n = groupData.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0;

    // Calculate sums for linear regression
    groupData.forEach((item) => {
      const x = item.xValue;
      const y = item.de;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // trend line values to the data for anilox type
    groupData.forEach((item) => {
      item.trendline = parseFloat((slope * item.xValue + intercept).toFixed(4));
    });
  });

  // data back into a single array
  return Object.values(groupedByAnilox).flat();
};

export const calculateSAPPercentage = (data) => {
  // Total number of items
  const totalItems = data.length;

  // Count the number of items where SAP is 1 (true)
  const sapYesCount = data.filter((item) => item.SAP === 1).length;

  // Calc percentage
  const percentage = (sapYesCount / totalItems) * 100;

  // percentage rounded to 2 decimal places
  return parseFloat(percentage.toFixed(2));
};

export const calculateAniloxPerformance = (data) => {
  // data by anilox
  const groupedByAnilox = data.reduce((acc, item) => {
    if (!acc[item.anilox]) {
      acc[item.anilox] = [];
    }
    acc[item.anilox].push(item);
    return acc;
  }, {});

  return Object.entries(groupedByAnilox).map(([anilox, items]) => {
    // Filter items with de values less than or equal to 3
    const validItems = items.filter((item) => parseDE(item.de) <= 3);

    // calc avg de
    const avgDE =
      validItems.length > 0
        ? parseFloat(
            (
              validItems.reduce((sum, item) => sum + parseDE(item.de), 0) /
              validItems.length
            ).toFixed(2)
          )
        : null;

    // Define upper limit Density target
    const upperlimit = 2;

    // count total occurance of each anilox
    const count = items.length;

    return {
      anilox,
      avgDE,
      upperlimit,
      count,
    };
  });
};

export const calculatePantoneTargetingAccuracy = (data) => {
  const pantoneColors = data.filter(
    (item) => item.colour_value && item.colour_type === "pantone"
  );

  // Filter for correctly targeted pantone colors
  const correctlyTargeted = pantoneColors.filter(
    (item) => item.target.toLowerCase() === "pantone"
  );
  return (correctlyTargeted.length / pantoneColors.length) * 100;
};

export const calculateMasterTargetingAccuracy = (data) => {
  const masterColors = data.filter((item) => item.colour_type === "special");
  const correctlyTargeted = masterColors.filter(
    (item) => item.target.toLowerCase() === "master"
  );
  return (correctlyTargeted.length / masterColors.length) * 100;
};

export const calculateLABTargetingAccuracy = (data) => {
  const labColors = data.filter((item) => item.colour_type === "special");
  const correctlyTargeted = labColors.filter(
    (item) => item.target.toLowerCase() === "lab"
  );
  return (correctlyTargeted.length / labColors.length) * 100;
};

export const calculateRightFirstTime = (data, threshold = 2.1) => {
  const validJobs = data.filter((item) => item.onPrevJob !== 1);
  const jobsUnderThreshold = validJobs.filter(
    (item) => parseDE(item.de) < threshold
  );
  console.log("Valid Jobs", validJobs.length);
  console.log("Jobs under 2.1", jobsUnderThreshold.length);
  return (jobsUnderThreshold.length / validJobs.length) * 100;
};

export const prepareDEOverTimeData = (data) => {
  const validData = data.filter(
    (item) => item && item.date && item.de && parseDE(item.de) <= 2.5
  );

  // group by date
  const groupedByDate = validData.reduce((acc, item) => {
    // mutate date obj
    const datePart = item.date.toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'
    if (!acc[datePart]) {
      acc[datePart] = [];
    }
    acc[datePart].push(item);
    return acc;
  }, {});

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); // 6 months ago

  return Object.entries(groupedByDate)
    .map(([date, items]) => {
      const parsedDate = new Date(date);
      return {
        date: parsedDate,
        displayDate: parsedDate.toLocaleDateString("en-GB"), // Format as 'DD-MM-YYYY'
        de: parseFloat(
          (
            items.reduce((sum, item) => sum + parseDE(item.de), 0) /
            items.length
          ).toFixed(2)
        ),
      };
    })
    .filter((item) => item.date >= sixMonthsAgo) // last 6 months
    .sort((a, b) => a.date - b.date)
    .map((item) => ({
      date: item.displayDate,
      de: item.de,
      target: 2,
    }));
};

export const prepareProcessQC = (data, string) => {
  const groupedData = {};

  // group by anilox
  data.forEach(({ anilox, press_result, proofer_result }) => {
    if (!groupedData[anilox]) {
      groupedData[anilox] = {
        count: 0,
        press_results: [],
        proofer_results: [],
      };
    }
    groupedData[anilox].count += 1;
    groupedData[anilox].press_results.push(parseFloat(press_result));
    groupedData[anilox].proofer_results.push(parseFloat(proofer_result));
  });

  // thresholds and targets per colour
  const thresholds = {
    cyan: { target: 1.61, min: 1.41 },
    yellow: { target: 0.91, min: 0.81 },
    magenta: { target: 1.41, min: 1.31 },
    black: { target: 1.45, min: 1.35 },
  };

  const selectedThreshold = thresholds[string] || thresholds.black;

  // Convert to chart format & merge threshold values
  const chartData = Object.keys(groupedData).map((anilox) => ({
    anilox,
    press_result:
      groupedData[anilox].press_results.reduce((a, b) => a + b, 0) /
      groupedData[anilox].press_results.length,
    proofer_result:
      groupedData[anilox].proofer_results.reduce((a, b) => a + b, 0) /
      groupedData[anilox].proofer_results.length,
    count: groupedData[anilox].count,
    colour: string,
    ...selectedThreshold, // Merge target and min values into each object
  }));

  return chartData;
};
