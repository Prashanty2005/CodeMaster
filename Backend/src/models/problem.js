const mongoose=require("mongoose");
const {Schema}= mongoose;


const problemSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard']
    },
    tags:[{
        type:String,
        enum:['array','string','hashtable','linkedlist','math','twopointers','tree','graph','depthfirstsearch',
            'breadthfirstsearch','binarysearch','dynamicprogramming','greedy','backtracking','stack','queue',
            'heap','slidingwindow','unionfind','trie','recursion','sorting','bitmanipulation','divideandconquer',
            'segmenttree','fenwicktree','topologicalsort','design','simulation','memoization'],
        required:true
    }],
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            }
        }

    ],
    startCode:[
        {
            language:{
                type:String,
                required:true
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],
    //store actual solution of given question, so that if a paid user come to give him sol
    referenceSolution:[
        {
            language:{
                type:String,
                required:true
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],
    problemCreater:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    explanation: {
    type: String,
    required: false, // Make it optional
    default: ''
    }
})


const problem= mongoose.model('problem',problemSchema);

module.exports= problem