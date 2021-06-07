 const queryForm ={
    extQueryList: [
        {
          field: "deptId",
          expressionList: [
            {
              operator: "EQ",
              lowerValue: this.deptId,
              upperValue: ""
            }
          ]
        },
        {
          field: "postName",
          expressionList: [
            {
              operator: "EQ",
              lowerValue: this.postName,
              upperValue: ""
            }
          ]
        },
        {
          field: "postCode",
          expressionList: this.inputQuery
        },
        {
          field: "category",
          expressionList: this.selectQuery
        },
        {
          field: "userId",
          expressionList: [
            {
              operator: "EQ",
              lowerValue: this.userId,
              upperValue: ""
            }
          ]
        }
      ]
} 
export default queryForm;