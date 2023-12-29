const Employee = require("../Models/employee");
const Attendance = require("../Models/attendance");
const verifyUser = require("../middleware");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = require("express").Router()
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');
const PDFDocument = require('pdfkit');
//const { default: AddEmployee } = require("../../client/src/AddEmployee");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})


// {Employee}
//  EMPLOYEE CREATE 
router.route('/create').post(upload.single('image'), async (req, res) => {
    try {
        const {
            month,
            name,
            email,
            dateofjoined,
            password,
            employeecode,
            area,
            department,
            designation,
            pfuna,
            esinum,
            bankname,
            bankacc,
            daysinmonth,
            daysworked,
            fixedctc,
            salaryfix,
            salaryearn,
            hrafix,
            hraearn,
            conallowancefix,
            conallowanceearn,
            bonusfix,
            bonusearn,
            splallowancefix,
            splallowanceearn,
            medallowancefix,
            medallowanceearn,
            petallowancefix,
            petallowanceearn,
            othallowancefix,
            othallowanceearn,
            fullattenfix,
            fullattenearn,
            perbonusfix,
            perbonusearn,
            otfix,
            otearn,
            pf,
            esi,
            pt,
            tds,
            advance,
            late,
            mobile,
            medinsu,
            othdeduct
        } = req.body;
        const hashedPassword = await bcrypt.hash(password.toString(), 10);
        const newEmployee = new Employee({
            month,
            name,
            email,
            dateofjoined,
            password: hashedPassword,
            image: req.file.filename,
            employeecode,
            area,
            department,
            designation,
            pfuna,
            esinum,
            bankname,
            bankacc,
            daysinmonth,
            daysworked,
            fixedctc,
            salaryfix,
            salaryearn,
            hrafix,
            hraearn,
            conallowancefix,
            conallowanceearn,
            bonusfix,
            bonusearn,
            splallowancefix,
            splallowanceearn,
            medallowancefix,
            medallowanceearn,
            petallowancefix,
            petallowanceearn,
            othallowancefix,
            othallowanceearn,
            fullattenfix,
            fullattenearn,
            perbonusfix,
            perbonusearn,
            otfix,
            otearn,
            pf,
            esi,
            pt,
            tds,
            advance,
            late,
            mobile,
            medinsu,
            othdeduct
        });
        await newEmployee.save();
        return res.json({ Status: "Success" });
    } catch (err) {
        return res.json({ Error: "Error in signup process" });
    }
});


// employee login
router.route("/employeelogin").post(async (req, res) => {
    try {
        const employee = await Employee.findOne({ email: req.body.email });
        if (!employee) {
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }
        const isPasswordValid = await bcrypt.compare(req.body.password.toString(), employee.password);
        if (!isPasswordValid) {
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }
        const token = jwt.sign({ role: "employee", id: employee._id }, "jwt-secret-key", { expiresIn: '1d' });
        res.cookie('token', token);
        return res.json({ Status: "Success", id: employee._id });
    } catch (err) {
        return res.json({ Status: "Error", Error: "Error in running query" });
    }
});

// logout
router.route("/logout").get((req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

// Get All Empleoye
router.route("/getEmployee").get(async (req, res) => {
    try {
        const employees = await Employee.find();
        return res.json({ Status: "Success", Result: employees });
    } catch (err) {
        return res.json({ Error: "Get employee error in MongoDB" });
    }
});
// Get single Employe 
router.route("/get/:id").get(async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        return res.json({ Status: "Success", Result: employee });
    } catch (err) {
        return res.json({ Error: "Get employee error in MongoDB" });
    }
});

//download pdf
router.get('/emppdf/:id', async (req, res) => {
    const doc = new PDFDocument();
    // Set up the response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=payslip.pdf');

    // Create the PDF content
    doc.pipe(res);

    // Add company details
    doc.fontSize(15)
        .text('DATAVALLEY INDIA PRIVATE LIMITED', { align: 'center' })
        .text('Second Floor, Unit No 203', { align: 'center' })
        .text('Madhapur, Hyderabad', { align: 'center' });

    // Add spacing
    doc.moveDown(1);

    // Add heading
    doc.fontSize(20).text('Pay Slip of the Month', { align: 'center' });

    // Add spacing
    doc.moveDown();

    // Draw the table manually with left margin
    const tableData = [
        ['Name of Employee', 'Teja', 'Date of Join', '23/04/23'],
        ['Employee Code', '234', 'Area', 'Bazawada'],
        ['Department', 'Development', 'Designation', 'Full Stack Trainer'],
    ];

    const tableTop = doc.y;
    const marginLeft = 5; // Set the left margin
    doc
        .fontSize(16)
        .text('Name of Employee :', 20 + marginLeft, tableTop)
        .text(employee.name, 27 + 150 - marginLeft, tableTop)
        .text('Date of Join :', 10 + 300 - marginLeft, tableTop)
        .text(employee.dateofjoined, 450 - marginLeft, tableTop)
        .text('Employee Code :', 20 + marginLeft, tableTop + 25)
        .text(employee.employeecode, 27 + 150 - marginLeft, tableTop + 25)
        .text('Area :', 10 + 300 - marginLeft, tableTop + 25)
        .text(employee.area, 450 - marginLeft, tableTop + 25)
        .text('Department :', 20 + marginLeft, tableTop + 50)
        .text(employee.department, 27 + 150 - marginLeft, tableTop + 50)
        .text('Designation :', 10 + 300 - marginLeft, tableTop + 50)
        .text(employee.designation, 450 - marginLeft, tableTop + 50);

    // Draw spacing between tables
    doc.moveDown(1);

    // Draw the second table manually with left margin
    const tableData2 = [
        ['Field 1', 'Value 1', 'Field 2', 'Value 2'],
        ['Field 3', 'Value 3', 'Field 4', 'Value 4'],
        ['Field 5', 'Value 5', 'Field 6', 'Value 6'],
    ];

    const tableTop2 = doc.y;
    const marginLeft2 = 5; // Set the left margin for the second table
    doc
        .fontSize(16)
        .text('PF UNA:', 20 + marginLeft2, tableTop2)
        .text(employee.pfuna, 10 + 150 - marginLeft2, tableTop2)
        .text('ESI Number:', 10 + 300 - marginLeft2, tableTop2)
        .text(employee.esinum, 10 + 450 - marginLeft2, tableTop2)
        .text('Bank name:', 20 + marginLeft2, tableTop2 + 25)
        .text(employee.bankname, 10 + 150 - marginLeft2, tableTop2 + 25)
        .text('Bank account:', 10 + 300 - marginLeft2, tableTop2 + 25)
        .text(employee.bankacc, 10 + 450 - marginLeft2, tableTop2 + 25)
    // Draw spacing between tables
    doc.moveDown(1);

    const tableTop3 = doc.y;
    const marginLeft3 = 5; // Set the left margin for the third table
    doc
        .fontSize(16)
        .text('Days in Month:', 20 + marginLeft3, tableTop3)
        .text(employee.daysinmonth, 20 + 150 - marginLeft3, tableTop3)
        .text('Days Worked:', 20 + 300 - marginLeft3, tableTop3)
        .text(employee.daysworked, 20 + 450 - marginLeft3, tableTop3)
        .text('Fixed CTC:', 20 + marginLeft3, tableTop3 + 25)
        .text(employee.fixedctc, 20 + 150 - marginLeft3, tableTop3 + 25);

    doc.moveDown(1);
    const tableTop4 = doc.y;
    const marginLeft4 = 5; // Set the left margin for the third table
    doc
        .fontSize(17)
        .text('Salary details', 150 - marginLeft4, tableTop4)
        .text('Deductions', 400 - marginLeft4, tableTop4)
    doc
        .fontSize(15)
        .text('Details', 15 + marginLeft4, tableTop4 + 20)
        .text('FIXED', 150 - marginLeft4, tableTop4 + 20)
        .text('EARNED', 255 - marginLeft4, tableTop4 + 20)
        .text('Details', 385 - marginLeft4, tableTop4 + 20)
        .text('Amount', 470 - marginLeft4, tableTop4 + 20);
    doc
        .fontSize(14)
        .text('Basic Salary', 15 + marginLeft4, tableTop4 + 40)
        .text(employee.salaryfix, 165 - marginLeft4, tableTop4 + 40)
        .text(employee.salaryearn, 270 - marginLeft4, tableTop4 + 40)
        .text('PF', 400 - marginLeft4, tableTop4 + 40)
        .text(employee.pf, 500 - marginLeft4, tableTop4 + 40)

        .text('HRA', 15 + marginLeft4, tableTop4 + 60)
        .text(employee.hrafix, 165 - marginLeft4, tableTop4 + 60)
        .text(employee.hraearn, 270 - marginLeft4, tableTop4 + 60)
        .text('ESI', 400 - marginLeft4, tableTop4 + 60)
        .text(employee.esi, 500 - marginLeft4, tableTop4 + 60)

        .text('Conveyance Allowance', 15 + marginLeft4, tableTop4 + 80)
        .text(employee.conallowancefix, 180 - marginLeft4, tableTop4 + 80)
        .text(employee.conallowanceearn, 270 - marginLeft4, tableTop4 + 80)
        .text('PT', 400 - marginLeft4, tableTop4 + 80)
        .text(employee.pt, 500 - marginLeft4, tableTop4 + 80)

        .text('Exgratia', 15 + marginLeft4, tableTop4 + 100)
        .text(employee.bonusfix, 165 - marginLeft4, tableTop4 + 100)
        .text(employee.bonusearn, 270 - marginLeft4, tableTop4 + 100)
        .text('TDS', 400 - marginLeft4, tableTop4 + 100)
        .text(employee.tds, 500 - marginLeft4, tableTop4 + 100)

        .text('Special Allowance', 15 + marginLeft4, tableTop4 + 120)
        .text(employee.splallowancefix, 165 - marginLeft4, tableTop4 + 120)
        .text(employee.splallowanceearn, 270 - marginLeft4, tableTop4 + 120)
        .text('Advance', 400 - marginLeft4, tableTop4 + 120)
        .text(employee.advance, 500 - marginLeft4, tableTop4 + 120)

        .text('Medical Allowance', 15 + marginLeft4, tableTop4 + 140)
        .text(employee.medallowancefix, 180 - marginLeft4, tableTop4 + 140)
        .text(employee.medallowanceearn, 270 - marginLeft4, tableTop4 + 140)
        .text('Late', 400 - marginLeft4, tableTop4 + 140)
        .text(employee.late, 500 - marginLeft4, tableTop4 + 140)

        .text('Petrol Allowance', 15 + marginLeft4, tableTop4 + 160)
        .text(employee.petallowancefix, 165 - marginLeft4, tableTop4 + 160)
        .text(employee.petallowanceearn, 270 - marginLeft4, tableTop4 + 160)
        .text('Mobile Phones', 400 - marginLeft4, tableTop4 + 160)
        .text(employee.mobile, 500 - marginLeft4, tableTop4 + 160)

        .text('Other Allowance', 15 + marginLeft4, tableTop4 + 180)
        .text(employee.othallowancefix, 165 - marginLeft4, tableTop4 + 180)
        .text(employee.othallowanceearn, 270 - marginLeft4, tableTop4 + 180)
        .text('Medical Insurence', 375 - marginLeft4, tableTop4 + 180)
        .text(employee.medinsu, 510 - marginLeft4, tableTop4 + 180)

        .text('Full Attendence', 15 + marginLeft4, tableTop4 + 200)
        .text(employee.fullattenfix, 165 - marginLeft4, tableTop4 + 200)
        .text(employee.fullattenearn, 270 - marginLeft4, tableTop4 + 200)
        .text('Other Deductions', 375 - marginLeft4, tableTop4 + 200)
        .text(employee.advance, 510 - marginLeft4, tableTop4 + 200)

        .text('Performance Bonus', 15 + marginLeft4, tableTop4 + 220)
        .text(employee.perbonusfix, 165 - marginLeft4, tableTop4 + 220)
        .text(employee.perbonusearn, 270 - marginLeft4, tableTop4 + 220)

        .text('Overtime', 15 + marginLeft4, tableTop4 + 240)
        .text(employee.otfix, 165 - marginLeft4, tableTop4 + 240)
        .text(employee.otearn, 270 - marginLeft4, tableTop4 + 240)

        .text('Total Gross', 15 + marginLeft4, tableTop4 + 260)
        .text(fixgross, 165 - marginLeft4, tableTop4 + 260)
        .text(earngross, 270 - marginLeft4, tableTop4 + 260)
        .text('Total', 400 - marginLeft4, tableTop4 + 260)
        .text(totaldetuct, 500 - marginLeft4, tableTop4 + 260)

        .text('Net Salary', 15 + marginLeft4, tableTop4 + 280)
        .text(earngross - totaldetuct, 200 - marginLeft4, tableTop4 + 280)
    // End the document
    doc.end();
});

//download the pdf
router.get('/downloadpdf/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        const fixgross = parseFloat(employee.salaryfix) +
            parseFloat(employee.hrafix) +
            parseFloat(employee.conallowancefix) +
            parseFloat(employee.bonusfix) +
            parseFloat(employee.splallowancefix) +
            parseFloat(employee.medallowancefix) +
            parseFloat(employee.petallowancefix) +
            parseFloat(employee.othallowancefix) +
            parseFloat(employee.fullattenfix) +
            parseFloat(employee.perbonusfix) +
            parseFloat(employee.otfix);
        const earngross = parseFloat(employee.salaryearn) +
            parseFloat(employee.hraearn) +
            parseFloat(employee.conallowanceearn) +
            parseFloat(employee.bonusearn) +
            parseFloat(employee.splallowanceearn) +
            parseFloat(employee.medallowanceearn) +
            parseFloat(employee.petallowanceearn) +
            parseFloat(employee.othallowanceearn) +
            parseFloat(employee.fullattenearn) +
            parseFloat(employee.perbonusearn) +
            parseFloat(employee.otearn);
        const totaldeduct = parseFloat(employee.pf) +
            parseFloat(employee.esi) +
            parseFloat(employee.pt) +
            parseFloat(employee.tds) +
            parseFloat(employee.advance) +
            parseFloat(employee.late) +
            parseFloat(employee.mobile) +
            parseFloat(employee.medinsu) +
            parseFloat(employee.othdeduct);

        //const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        const htmlTemplate = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
    }

    h1 {
      color: #333;
    }

    table {
      width: 90%;
      margin: 10px auto; /* Adjusted margin for smaller spacing */
      border-collapse: collapse;
    }

    th, td {
      padding: 5px;
      border: 1px solid #ddd;
    }
    /* Add some styles for the logo */
    #logo {
      max-width: 7rem;
      height: 7rem;
      margin-bottom: 20px;
      border-radius: 50%;
    }
  </style>
  <title>Employee Pay Slip</title>
</head>
<body>
<img src="https://cdn.pixabay.com/photo/2015/08/19/05/17/large-895567_1280.jpg" alt="Company Logo" id="logo">

  <!-- Company Details -->
  <p>DATAVALLEY INDIA PRIVATE LIMITED</p>
  <p>Second Floor, Unit No 203</p>
  <p>Madhapur, Hyderabad</p>

  <!-- Heading -->
  <h1>Pay Slip of the Month ${employee.month}</h1>

  <!-- Table 1 -->
<table>
  <tr>
    <th>Name of Employee</th>
    <td>${employee.name}</td>
    <th>Date of Joining</th>
    <td>${employee.dateofjoined}</td>
  </tr>
  <tr>
    <th>Employee code</th>
    <td>${employee.employeecode}</td>
    <th>Area</th>
    <td>${employee.area}</td>
  </tr>
  <tr>
    <th>Department</th>
    <td>${employee.department}</td>
    <th>Designation</th>
    <td>${employee.designation}</td>
  </tr>
</table>


  <!-- Table 2 -->
  <table>
    <tr>
    <th>PF UNA</th>
    <td>${employee.pfuna}</td>
    <th>ESI Number</th>
    <td>${employee.esinum}</td>
  </tr>
    <tr>
    <th>Bank Name</th>
    <td>${employee.bankname}</td>
    <th>bank A/c Number</th>
    <td>${employee.bankacc}</td>
  </tr>
  </table>

  <!-- Table 3 -->
  <table>
    <tr>
    <th>Days in month</th>
    <td>${employee.daysinmonth}</td>
    <th>Days Worked</th>
    <td>${employee.daysworked}</td>
  </tr>
    <tr>
    <th>Fixed Salary CTC</th>
    <td>${employee.fixedctc}</td>
    <td></td>
    <td></td>
  </tr>
  </table>

  <!-- Table 4 -->
  <table>
    <tr>
      <th colspan="3">Salary Details</th>
      <th colspan="2">Deductions</th>
    </tr>
    <tr>
      <th>Details</th>
      <th>Fixed</th>
      <th>Earned</th>
      <th>Details</th>
      <th>Amount</th>
    </tr>
    <tr>
      <td>Basic salary</td>
      <td>${employee.salaryfix}</td>
      <td>${employee.salaryearn}</td>
      <td>PF</td>
      <td>${employee.pf}</td>
    </tr>
    <tr>
      <td>HRA</td>
      <td>${employee.hrafix}</td>
      <td>${employee.hraearn}</td>
      <td>ESI</td>
      <td>${employee.esi}</td>
    </tr>
    <tr>
      <td>Conveyance Allowance</td>
      <td>${employee.conallowancefix}</td>
      <td>${employee.conallowanceearn}</td>
      <td>PT</td>
      <td>${employee.pt}</td>
    </tr>
    <td>Exgratia</td>
      <td>${employee.bonusfix}</td>
      <td>${employee.bonusearn}</td>
      <td>TDS</td>
      <td>${employee.tds}</td>
    </tr>
    <tr>
      <td>Special Allowance</td>
      <td>${employee.splallowancefix}</td>
      <td>${employee.splallowanceearn}</td>
      <td>Advance</td>
      <td>${employee.advance}</td>
    </tr>
    <tr>
      <td>Medical Allowance</td>
      <td>${employee.medallowancefix}</td>
      <td>${employee.medallowanceearn}</td>
      <td>Late</td>
      <td>${employee.late}</td>
    </tr>
    <td>Petrol Allowance</td>
      <td>${employee.petallowancefix}</td>
      <td>${employee.petallowanceearn}</td>
      <td>Mobile Phone</td>
      <td>${employee.mobile}</td>
    </tr>
    <tr>
      <td>Other Additions</td>
      <td>${employee.othallowancefix}</td>
      <td>${employee.othallowanceearn}</td>
      <td>Medical Insurence</td>
      <td>${employee.medinsu}</td>
    </tr>
    <tr>
      <td>Full Attendence</td>
      <td>${employee.fullattenfix}</td>
      <td>${employee.fullattenearn}</td>
      <td>Other Deduction</td>
      <td>${employee.othdeduct}</td>
    </tr>
    <tr>
      <td>Performace Bonus</td>
      <td>${employee.perbonusfix}</td>
      <td>${employee.perbonusearn}</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Overtime</td>
      <td>${employee.otfix}</td>
      <td>${employee.otearn}</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Total Gross Salary</th>
      <th>${fixgross}</th>
      <th>${earngross}</th>
      <th>Total Deduction</th>
      <th>${totaldeduct}</th>
    </tr>
    
    <tr>
      <th colspan="2">Net Salary</th>
      <th colspan="3">${earngross - totaldeduct}</th>
    </tr>
  </table>
  <h4>Note: This is a system generated pay slip does not required Signature</h4>
</body>
</html>
      `;
        const pdfOptions = { format: 'Letter' };
        pdf.create(htmlTemplate, pdfOptions).toFile((err, pdfPath) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error generating PDF' });
            }
            res.download(pdfPath.filename, 'Employee_Pay_Slip.pdf', (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error sending PDF' });
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// UPDATE EMPLOYEE  
router.route("/update/:id").put(async (req, res) => {
    try {
        const {
            month,
            name,
            email,
            dateofjoined,
            employeecode,
            area,
            department,
            designation,
            pfuna,
            esinum,
            bankname,
            bankacc,
            daysinmonth,
            daysworked,
            fixedctc,
            salaryfix,
            salaryearn,
            hrafix,
            hraearn,
            conallowancefix,
            conallowanceearn,
            bonusfix,
            bonusearn,
            splallowancefix,
            splallowanceearn,
            medallowancefix,
            medallowanceearn,
            petallowancefix,
            petallowanceearn,
            othallowancefix,
            othallowanceearn,
            fullattenfix,
            fullattenearn,
            perbonusfix,
            perbonusearn,
            otfix,
            otearn,
            pf,
            esi,
            pt,
            tds,
            advance,
            late,
            mobile,
            medinsu,
            othdeduct
        } = req.body;
        const updatedEmployee = {
            month,
            name,
            email,
            dateofjoined,
            employeecode,
            area,
            department,
            designation,
            pfuna,
            esinum,
            bankname,
            bankacc,
            daysinmonth,
            daysworked,
            fixedctc,
            salaryfix,
            salaryearn,
            hrafix,
            hraearn,
            conallowancefix,
            conallowanceearn,
            bonusfix,
            bonusearn,
            splallowancefix,
            splallowanceearn,
            medallowancefix,
            medallowanceearn,
            petallowancefix,
            petallowanceearn,
            othallowancefix,
            othallowanceearn,
            fullattenfix,
            fullattenearn,
            perbonusfix,
            perbonusearn,
            otfix,
            otearn,
            pf,
            esi,
            pt,
            tds,
            advance,
            late,
            mobile,
            medinsu,
            othdeduct
        };
        await Employee.findByIdAndUpdate(req.params.id, updatedEmployee);
        return res.json({ Status: "Success" });
    } catch (err) {
        return res.json(err);
    }
});

// DELETE Route
router.route("/delete/:id").delete(async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        return res.json({ Status: "Success" });
    } catch (err) {
        return res.json({ Error: "Delete employee error in MongoDB" });
    }
});


// Dashboard
router.route("/dashboard").get(verifyUser, (req, res) => {
    return res.json({ Status: "Success", email: req.email, id: req.id });
});
// Get All admins
router.route('/getAdmins').get(async (req, res) => {
    try {
        const employees = await Employee.find({ role: "admin" });
        return res.json({ Status: "Success", Result: employees });
    } catch (err) {
        return res.json({ Error: "Get employee error in MongoDB" });
    }
});
//  Admin Count
router.route('/adminCount').get(async (req, res) => {
    try {
        const adminCount = await Employee.find({ role: "admin" });
        return res.json({ admin: adminCount.length });
    } catch (err) {
        return res.json({ Error: "Error in running query" });
    }
});
//  Salary Count
router.route('/salary').get(async (req, res) => {
    try {
        // Find employees with role "employee" using $match stage
        const employees = await Employee.aggregate([
            {
                $match: { role: "employee" }
            },
            {
                $group: {
                    _id: null,
                    sumOfSalary: { $sum: "$salary" }
                }
            }
        ]);

        if (employees.length === 0) {
            return res.json({ sumOfSalary: 0 });
        }

        return res.json({ sumOfSalary: employees[0].sumOfSalary });
    } catch (err) {
        return res.json({ Error: "Error in running query" });
    }
});

//  Emplooye Count
router.route('/employeeCount').get(async (req, res) => {
    try {
        const employeeCount = await Employee.find({ role: "employee" });
        console.log(employeeCount)
        return res.json({ employee: employeeCount.length });
    } catch (err) {
        console.log(err)
        return res.json(err);
    }
});

//  Login
router.route('/login').post(async (req, res) => {
    try {
        if (req.body.email == "admin@gmail.com" && req.body.password == "adminpassword") {

            const token = jwt.sign({ email: req.body.email }, "jwt-secret-key", { expiresIn: '1d' });
            res.cookie('token', token);
            return res.json({ Status: "Success" });
        } else {
            return res.json({ Status: "Error", Error: "Invalid Email or Password" })
        }
    } catch (err) {
        console.log(err)
        return res.json({ Status: "Error", Error: "Error in running query" });
    }
});

// Create Attendance Record
router.route("/attendance").post(async (req, res) => {
    try {
        const { employeeId, date, status } = req.body;

        // Here you can validate the data if needed before saving it to the database

        const newAttendance = new Attendance({
            employeeId: employeeId,
            date: date,
            status: status
        });

        await newAttendance.save();
        return res.json({ Status: "Success" });
    } catch (err) {
        console.log(err);
        return res.json({ Status: "Error", Error: "Error in running query" });
    }
}
)
// get all attenadnces
router.route("/attendances").get(async (req, res) => {
    try {
        const attendances = await Attendance.find({})
        return res.json({ Status: "Success", attendances })
    } catch (err) {
        console.log(err)
        return res.json({ Status: "Error", Error: "Error in running query" });
    }
})

// Get single attendecnse
router.route("/attendace").get(async (req, res) => {
    const { id } = req.query; // Use req.query to access query parameters
    try {
        console.log(id);
        const attenadnce = await Attendance.find({ employeeId: id });
        return res.json({ Status: "Success", attenadnce });
    } catch (err) {
        s
        console.log(err);
        return res.json({ Status: "Error", Error: "Error in running query" });
    }
});

module.exports = router