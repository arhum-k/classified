import { NextResponse } from "next/server";
import Airtable from "airtable";

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = 'appvSU2QqcPItmX0X';
const featureReqTableName = 'Feature Requests';



export async function POST(request: Request){
    try {
        const body = await request.json();
        const userEmail = body.email || "anonymous";
        console.log(userEmail)
        const featureRequest = body.featureRequest;
    
        console.log("Feature Request:", featureRequest);

        const base = new Airtable({ apiKey }).base(baseId);
    
        await base(featureReqTableName).create([
          {
            "fields": {
                "Email": userEmail,
                "Feature Request": featureRequest,
                "Date": new Date().toISOString()
            }
          }
        ]);
    
        return NextResponse.json({
          status: 200,
          message: 'Feature request submitted successfully'
        });
      } catch (err) {
        console.error(err);
        return NextResponse.json({
          status: 500,
          message: 'Failed to submit feature request'
        });
      }
    }