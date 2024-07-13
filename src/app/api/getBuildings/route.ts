import { NextResponse } from "next/server";

interface RoomInfo {
    templateType: number;
    itemId: number | string;
    itemName: string;
    itemTypeId: number;
  }
interface Room {
    contextId: number;
    row: [
      RoomInfo,
      string, // Building Name
      string, // Categories
      string, // Features
      string, // Layouts
      number, // Max Capacity
      number, // Default Capacity
      RoomInfo
    ];
  }

  interface TimePeriod {
    start: string;
    end: number | string;
    itemName: string;

  }
  
interface Unavailability {
    itemId: number;
    itemName: string;
    items: TimePeriod[];
  }
  
export async function POST(request: Request){
    const requestBody = await request.json()
    console.log("request body:"+requestBody)
    const building = requestBody.building || '';
    const date = requestBody.date
    var numRooms;
    var buildingsInfo: Record<string, any>;

//fetch info abt each room
    var numRoomDataPages;
    const roomDataQueryInfo = {
        url: 'https://25live.collegenet.com/25live/data/berkeley/run/list/listdata.json',
        params: new URLSearchParams({
            compsubject: 'location',
            page: '1',
            page_size: '25',
            obj_cache_accl: '0',
            query_id: '2195',
            caller: 'pro-ListService.getData'
          }),
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "baggage": "sentry-environment=production,sentry-public_key=625689fee347e3cb041149c5d68bb169,sentry-trace_id=54306155c0c24ac4b8788a6d5a5623a2,sentry-sample_rate=1,sentry-sampled=true",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sentry-trace": "54306155c0c24ac4b8788a6d5a5623a2-b951ca12b48ef8c6-1",
            "cookie": "Blaze=ZnCQ9D0pzdgAWI7VE5iVmQAm7yA; dtCookie=v_4_srv_1_sn_604B90AB00B33F6DE4B9C1F5A5DAE6D5_perc_100000_ol_0_mul_1_app-3A1163e2691a52ad25_0; WSSESSIONID=9CA8F41462C332548658CCC4CD79801B; BIGipServerp-java.25live-web.collegenet.com=187172618.36895.0000",
            "Referer": "https://25live.collegenet.com/pro/berkeley",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          }
    }

    try {
        const firstPageRoomDataResponse = await fetch (`${roomDataQueryInfo.url}?${roomDataQueryInfo.params}`, {
            method: 'GET',
            headers: roomDataQueryInfo.headers
        })
        const firstPageRoomDataResponseJson = await firstPageRoomDataResponse.json()
        
        numRooms = firstPageRoomDataResponseJson.rows[0].count
        numRoomDataPages = firstPageRoomDataResponseJson.rows[0].pages

        //fetch the rest of the pages, if any
        while (numRoomDataPages > 1) {
            roomDataQueryInfo.params.set('page', numRoomDataPages.toString());
            console.log("Fetching page: " + roomDataQueryInfo.params.get('page')); 
            const nextPageRoomDataResponse = await fetch (`${roomDataQueryInfo.url}?${roomDataQueryInfo.params}`, {
                method: 'GET',
                headers: roomDataQueryInfo.headers
            })
            const nextPageRoomDataResponseJson = await nextPageRoomDataResponse.json()
            firstPageRoomDataResponseJson.rows = firstPageRoomDataResponseJson.rows.concat(nextPageRoomDataResponseJson.rows)
            numRoomDataPages--;
        }
        buildingsInfo = organizeRoomData(firstPageRoomDataResponseJson)
    
    } catch (error){
        console.error('Error fetching room info data:', error);
        return NextResponse.json({
            err: error
        })
    }
    
    
//fetch room bookings
    const roomBookingsDataQueryInfo = {
        url: 'https://25live.collegenet.com/25live/data/berkeley/run/availability/availabilitydata.json',
        params: new URLSearchParams({
            'obj_cache_accl': '0',
            'start_dt': date,
            'comptype': 'availability',
            'compsubject': 'location',
            'page_size': numRooms,
            'spaces_query_id': '2195',
            'include': 'closed blackouts pending related empty',
            'caller': 'pro-AvailService.getData'
          }),
        headers: {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9',
            'baggage': 'sentry-environment=production,sentry-public_key=625689fee347e3cb041149c5d68bb169,sentry-trace_id=464d3398685940879f39aef5ca84c99d,sentry-sample_rate=1,sentry-sampled=true',
            'content-type': 'application/json',
            'priority': 'u=1, i',
            'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'sentry-trace': '464d3398685940879f39aef5ca84c99d-82c3850611251e6a-1',
            'cookie': 'Blaze=ZnCQ9D0pzdgAWI7VE5iVmQAm7yA; dtCookie=v_4_srv_1_sn_604B90AB00B33F6DE4B9C1F5A5DAE6D5_perc_100000_ol_0_mul_1_app-3A1163e2691a52ad25_0; BIGipServerp-java.25live-web.collegenet.com=186517258.36895.0000; WSSESSIONID=9CA8F41462C332548658CCC4CD79801B',
            'Referer': 'https://25live.collegenet.com/pro/berkeley',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
    }
    try {
        const roomBookingsResponse = await fetch(`${roomBookingsDataQueryInfo.url}?${roomBookingsDataQueryInfo.params}`, {
            method: 'GET',
            headers: roomBookingsDataQueryInfo.headers
        });

        const roomBookingsResponseJson = await roomBookingsResponse.json();
        storeBookingsInfoInRoomData(roomBookingsResponseJson)
        console.log(buildingsInfo)
        return NextResponse.json({
            result: buildingsInfo,
          });
    } catch (error) {
        console.error('Error fetching room bookings data:', error);
        return NextResponse.json({
            err: error
        })
    }

    function organizeRoomData(roomDataResponseJson: any) {
        const transformedData: Record<string, any> = {};
        roomDataResponseJson.rows.forEach((item: Room) => {
            const roomInfo = item.row;
            const roomId = roomInfo[0].itemName;
            const buildingCode = roomId.slice(0, 4); // Extract building code
            const buildingName = roomInfo[1].split(", Room ")[0]; // Extract building name
        
            if (!transformedData[buildingCode]) {
            transformedData[buildingCode] = {
                building_name: buildingName,
                rooms: {}
            };
            }
        
            transformedData[buildingCode].rooms[roomId] = {
            categories: roomInfo[2],
            features: roomInfo[3],
            layouts: roomInfo[4],
            max_capacity: roomInfo[5],
            default_capacity: roomInfo[6]
            };
        });
        return transformedData
    }

    function storeBookingsInfoInRoomData(roomBookingsResponseJson: any) {
        roomBookingsResponseJson.subjects.forEach((room: Unavailability) => {
            const roomId = room.itemName;
            const buildingCode = roomId.slice(0, 4); // Extract building code
        
            if (buildingsInfo[buildingCode] && buildingsInfo[buildingCode].rooms[roomId]) {
                const bookings = room.items
                  .filter((item: TimePeriod) => item.itemName === "(Private)")
                  .map((period: TimePeriod) => ({
                    start: Number(period.start as string),
                    end: roundToNearestHalf(Number(period.end as string))
                  }));
            
                const closed_hours = room.items
                  .filter((item: TimePeriod) => item.itemName === "Closed")
                  .map((period: TimePeriod) => ({
                    start: Number(period.start as string),
                    end: roundToNearestHalf(Number(period.end as string))
                  }));
            
                buildingsInfo[buildingCode].rooms[roomId].bookings = bookings;
                buildingsInfo[buildingCode].rooms[roomId].closed_hours = closed_hours;
              }
        });
    }
    function roundToNearestHalf(time: number) {
        const rounded = Math.round(time * 2) / 2;
        return rounded;
      };


}

