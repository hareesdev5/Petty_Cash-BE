const dataModel = require("../model/Data");


// create opening balance

const initialAmount = async (req, res) => {
  try {
    
    let {Amount,Notes} = req.body;
    if(Amount,Notes){
      let data = await dataModel.create({
        Amount,
        Notes,
        createdBy:req.headers.userId
      });
      res.status(200).send({
        message: "initial data added",
        data,
      });
    }
    else{
      res.status(400).send({
        message:'Amount,Notes required'
      })
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get Transaction

let getData = async (req, res) => {
  try {
    let amount = await dataModel.find({createdBy:req.headers.userId});
    res.status(200).send({
      message: "getData",
      amount,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete transition

let DeleteValue = async (req, res) => {
  let id = await dataModel.findOne({ _id: req.params.id });
  try {
    if (id) {
      await dataModel.deleteOne(id);
      res.status(200).send({
        message: "deleted Successfully",
      });
    } else {
      res.status(400).send({
        message: "invalid Id",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// adding Cash

const cashIn = async (req, res) => {
  try {
    let data = await dataModel.find({ createdBy: req.headers.userId });

    let total = data[data.length - 1];
    let { Amount, Notes, method } = req.body;

    if (total.Total) {
      let Total = total.Total + Amount;
      total.Amount = Amount;
      total.Notes = Notes;
      createdBy= req.headers.userId 
      method = "+";
      await dataModel.create({ Amount, Total, Notes,createdBy, method });
      res.status(200).send({
        message: "+",
        Total,
        Amount,Notes,method
      });
    } else {
      let Total = total.Amount + Amount;
      total.Amount = Amount;
      total.Notes = Notes;
      createdBy= req.headers.userId 
      method = "+";
      await dataModel.create({ Amount, Total, Notes,createdBy, method });
      res.status(200).send({
        message: "+",
        Total
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// remove cash

const cashOut = async (req, res) => {
  try {
    let data = await dataModel.find({ createdBy: req.headers.userId });

    let total = data[data.length - 1];

    let { Amount, Notes, method } = req.body;

    if (total.Total) {
      let Total = total.Total - Amount;
      total.Amount = Amount;
      total.Notes = Notes;
      createdBy= req.headers.userId 
      method = "-";
      await dataModel.create({ Amount, Total, Notes,createdBy, method });
    } else {
      let Total = total.Amount - Amount;
      total.Amount = Amount;
      total.Notes = Notes;
      createdBy= req.headers.userId 
      method = "-";
      await dataModel.create({ Amount, Total, Notes,createdBy, method });
    }
    res.status(200).send({
      message: "-",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get cashin 

const getDataByCashIn = async (req, res) => {
  try {
    let data = await dataModel.find({ method: "+",createdBy:req.headers.userId });
    res.status(200).send({
      message: "Data Fetched",
      data,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// get cashOUt

const getDataByCashOut = async (req, res) => {
  try {
    let data = await dataModel.find({method:'-',createdBy:req.headers.userId});
    res.status(200).send({
      message: "Data Fetched",
      data,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  initialAmount,
  getData,
  DeleteValue,
  cashIn,
  cashOut,
  getDataByCashIn,
  getDataByCashOut,
};
