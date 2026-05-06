const express=require("express");
const app=express();
app.use(express.json());
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`);
})

//get depots data
const fetchDepotsData=()=>{
    const url="http://20.207.122.201/evaluation-service/depots";
    return fetch(url)
        .then(response=>response.json())
        .then(data=>data);
};

//get vehicles data
const fetchVehiclesData=()=>{
    const url="http://20.207.122.201/evaluation-service/vehicles";
    return fetch(url)
        .then(response=>response.json())
        .then(data=>data);
};

//Solution:
/*Knapsack algorithm:
1.for each vehicle we have two options: include it in schedule orr not.
2.if we include the vehicle:we add its impact to our total impact and subtract its duration from our available mech hrs.
3.if we exclude the vehicle:move to next
4.repeat process for all vehicles
5.keep track of the max impact we can achieve with the given mech hrs.
*/ 
const knapsack=(vehicles, mechanicHours)=>{
    const n=vehicles.length;
    const dp=Array(n+1).fill(0).map(()=>Array(mechanicHours+1).fill(0));
    
    for(let i=1;i<=n;i++){
        for(let j=0;j<=mechanicHours;j++){
            if(vehicles[i-1].Duration<=j){
                dp[i][j]=Math.max(dp[i-1][j],dp[i-1][j-vehicles[i-1].Duration]+vehicles[i-1].Impact);
            } else {
                dp[i][j]=dp[i-1][j];
            }
        }
    }
    return dp[n][mechanicHours];
};

app.get("/optimal-vehicles", async (req,res) => {
    try {
        const depotsData=await fetchDepotsData();
        const vehiclesData=await fetchVehiclesData();

        const totalMechHours=depotsData.depots.reduce((sum,depot)=>sum+depot.MechanicHours,0);
        const maxImpact=knapsack(vehiclesData.vehicles,totalMechHours);

        res.json({maxImpact});

    } 
    catch (error) {
        res.status(500).json({error: "Server error"});
    }
});

const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})