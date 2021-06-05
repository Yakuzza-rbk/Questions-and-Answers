var axios = require("../apiService/connection");
const readQ = async (req, res) => {
  let id = req.params.id;
  try {
    let response = await axios.get(`questions/?product_id=${id}`);
    res.send(response.data);
  } catch (err) {
    res.send(err);
  }
};
const Updatehelp = async (req, res) => {
  let id = req.params.id;
  let obj = req.body;
 
  try {
    let response = await axios.put(`answers/${id}/helpful`);
    console.log('test1',response);
    res.send(response.data);
    
  } catch (err) {
    console.log(err);
  }

};
const addQ = async (req, res) => {
  try {
  let posted = await axios.post(`questions/`,req.body,{ headers: { Authorization: `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` } })
   res.send('POSTED!')
  }
  catch(err){
  console.log(err)
  }
}










module.exports = { readQ, Updatehelp, addQ };
