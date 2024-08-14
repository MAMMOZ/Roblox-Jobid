import { serve } from "bun";

let Roblox: any[] = [];
let Job: any[] = [];
let Good: any[] = [];
let blacklist: any[] = [];

async function getRoblox() {
    if (Roblox.length > 0) {
        return { "Roblox": Roblox, "Job":Job, "Good":Good, "blacklist":blacklist, "len": Roblox.length };
    } else {
        return `No`;
    }
}

async function addRoblox(User: string, Jobid: string, PlaceId: string) {
    let existingRecord = Roblox.find(record => record.User === User);
    
    if (!existingRecord) {
        Roblox.push({ User: User, Jobid: Jobid, PlaceId: PlaceId, Status: 0 });
        Job.push(Jobid);
        Good.push(Jobid);
        return `Good`;
    } else {
        if (existingRecord.PlaceId !== PlaceId) {
            existingRecord.Status = 4;
            existingRecord.Jobid = Jobid;
            existingRecord.PlaceId = PlaceId;
            return `Good`;
        } else if (existingRecord.Jobid !== Jobid && existingRecord.PlaceId === PlaceId) {
            existingRecord.Jobid = Jobid;
            return `Update Jobid`;
        } else if (existingRecord.Jobid === Jobid && existingRecord.PlaceId === PlaceId) {
            existingRecord.Status = 2;
            blacklist.push(Jobid);
            Job = Job.filter(job => job !== Jobid);
            return `Hop`;
        }
    }
}

async function removeRoblox(User: string) {
    const index = Roblox.findIndex(record => record.User === User);
    if (index > -1) {
        Roblox.splice(index, 1);
        return `User ${User} has been removed.`;
    } else {
        return `User ${User} not found.`;
    }
}

serve({
    port: 3000,
    async fetch(req) {
        let method = req.method;
        let url = new URL(req.url);
        let cut = url.pathname.split("/");
        
        let User = cut[1];
        let Jobid = cut[2];
        let PlaceId = cut[3];

        if (User === "undefined"||Jobid === "undefined"||PlaceId === "undefined") {
            return "undefined"
        }
        
        if (url.pathname === "/favicon.ico") {
            return new Response(null, { status: 204 });
        }
        
        if (User) {

            console.log(User,Jobid,PlaceId);
            if (method === "POST") {
                let result = await addRoblox(User, Jobid, PlaceId);
                return new Response(result, { status: 200 });
            } else if (method === "DELETE") {
                let result = await removeRoblox(User);
                return new Response(result, { status: 200 });
            } else {
                return new Response("Invalid request method.", { status: 405 });
            }
        } else {
            if (method === "GET") {
                let result = await getRoblox();
                console.log(result);
                return new Response(JSON.stringify(result), { status: 200 });
            }
        }
        return new Response("Invalid request", { status: 400 });
    }
});
