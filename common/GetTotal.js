async function GetTotal(Model) {
    const Total = await Model.countDocuments();
    return Total;
}

module.exports = { GetTotal };