// all test controllers will be placed here.


export async function sent(req,res) {
    res.status(200).send({message:"API sent",status:200})
    console.log(req.cookies)
}


export async function get(_,res) {
   res.send({message: "get test route",status: 200})   
}