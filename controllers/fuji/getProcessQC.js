import { pool1 } from "../../database.js";
import { prepareProcessQC } from "./dataProcessing/dataProcessing.js";

const getProcessQC = async (req, res) => {
  try {
    console.log("Received Colour:", req.body.colour);

    // assign the lowercase version directly to chartType
    const chartType = req.body.colour.toLowerCase();
    let chartData;

    switch (chartType) {
      case "cyan":
        const [cyanRows] = await pool1.promise().query("SELECT * FROM process_data WHERE colour = 'Cyan'");
        chartData = prepareProcessQC(cyanRows, "cyan");
        break;
      case "yellow":
        const [yellowRows] = await pool1.promise().query("SELECT * FROM process_data WHERE colour = 'Yellow'");
        chartData = prepareProcessQC(yellowRows, "yellow");
        break;
      case "magenta":
        const [magentaRows] = await pool1.promise().query("SELECT * FROM process_data WHERE colour = 'Magenta'");
        chartData = prepareProcessQC(magentaRows, "magenta");
        break;
      case "black":
        const [blackRows] = await pool1.promise().query("SELECT * FROM process_data WHERE colour = 'Black'");
        chartData = prepareProcessQC(blackRows, "black");
        break;
      default:
        const [defaultRows] = await pool1.promise().query("SELECT * FROM process_data WHERE colour = 'Cyan'");
        chartData = prepareProcessQC(defaultRows, "cyan");
        break;
    }

    return res.json({ chartData });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getProcessQC;
