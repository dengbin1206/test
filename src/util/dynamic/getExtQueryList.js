export function getExtQueryList (row) {
    console.log(row)
    let extQueryList = [];
    for (let key in row) {
        let obj = {}
        if(typeof(row[key]) =="object" && row[key]!=null){
            if(typeof(row[key]) =="object" && row[key].length>0 && !row[key][0].operator ) {
                obj.field = key;
                obj.expressionList = [
                    {
                        operator:'INLIKE',
                        lowerValue:row[key],
                        upperValue:""
                    }
                ]
                extQueryList.push(obj)
            }else{
                obj.field = key;
                obj.expressionList = row[key]
                extQueryList.push(obj)
            }    
        }else{
            obj.field = key;
            obj.expressionList = [
                {
                    operator:'EQ',
                    lowerValue:row[key],
                    upperValue:""
                }
            ]
            extQueryList.push(obj)
        }
    }
    return extQueryList
}