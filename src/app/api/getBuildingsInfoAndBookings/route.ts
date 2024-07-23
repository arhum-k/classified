import { NextResponse } from "next/server";
import { Room, TimeSlot, RoomUnavailability } from "@/app/types";

export async function POST(request: Request){
    const requestBody = await request.json()
    console.log(requestBody)
    const building = requestBody.building || '';
    const dateString = requestBody.dateString
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
        console.log("SUCCESS FETCHING ROOM INFO")
    
    } catch (error){
        console.error('Error fetching room info data:', error);
        return NextResponse.json({
            err: error
        })
    }
    
    
//fetch room bookings
    console.log(dateString);
    const roomBookingsDataQueryInfo = {
        url: 'https://25live.collegenet.com/25live/data/berkeley/run/availability/availabilitydata.json',
        params: new URLSearchParams({
            'obj_cache_accl': '0',
            'start_dt': dateString,
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
        console.log("SUCCESS FETCHING BOOKINGS INFO")
        return NextResponse.json({
            result: buildingsInfo,
            numRooms: numRooms,
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
        roomBookingsResponseJson.subjects.forEach((room: RoomUnavailability) => {
            const roomId = room.itemName.split(" ")[0];
            const buildingCode = roomId.slice(0, 4); // Extract building code
            if (buildingsInfo[buildingCode] && buildingsInfo[buildingCode].rooms[roomId]) {
                const bookings = room.items
                .filter((item) => item.itemName === "(Private)")
                .map((period: TimeSlot) => ({
                    start: Number(period.start),
                    end: roundToNearestHalf(Number(period.end)),
                    itemName:"Booked"
                  }));
            
                const closed_hours = room.items
                  .filter((item: TimeSlot) => item.itemName === "Closed")
                  .map((period: TimeSlot) => ({
                    start: Number(period.start),
                    end: roundToNearestHalf(Number(period.end)),
                    itemName:"Closed"
                  }));

                  closed_hours.push(
                    { start: 23, end: 24, itemName: "Closed" },
                    { start: 0, end: 6, itemName: "Closed" }
                  );

                const mergedClosedHours = mergeTimeSlots(closed_hours);

            
                buildingsInfo[buildingCode].rooms[roomId].bookings = bookings;
                buildingsInfo[buildingCode].rooms[roomId].closed_hours = mergedClosedHours;
                buildingsInfo[buildingCode].rooms[roomId].availability = calculateAvailability(bookings, closed_hours);
                  
              }
        });
    }

    function calculateAvailability(bookings: TimeSlot[], closedHours: TimeSlot[]): TimeSlot[] {
      const mergedPeriods = [...bookings, ...closedHours].sort((a, b) => Number(a.start) - Number(b.start));
      const availability: TimeSlot[] = [];
    
      let endOfLastPeriod = 0;
    
      mergedPeriods.forEach((period) => {
        const start = Number(period.start);
        const end = Number(period.end);
    
        if (start > endOfLastPeriod) {
          availability.push({
            start: endOfLastPeriod,
            end: start,
            itemName: "Available"
          });
        }
        endOfLastPeriod = Math.max(endOfLastPeriod, end);
      });
    
      // Assuming the end of the day is 24 hours
      if (endOfLastPeriod < 24) {
        availability.push({
          start: endOfLastPeriod,
          end: 24,
          itemName: "Available"
        });
      }
    
    
      return availability;
    }

    function mergeTimeSlots(periods: TimeSlot[]): TimeSlot[] {
      if (periods.length === 0) return [];
    
      // Sort periods by start time
      periods.sort((a, b) => Number(a.start) - Number(b.start));
    
      const merged: TimeSlot[] = [];
      let currentPeriod = periods[0];
    
      for (let i = 1; i < periods.length; i++) {
        const nextPeriod = periods[i];
    
        if (Number(nextPeriod.start) <= Number(currentPeriod.end)) {
          // Overlapping or contiguous periods, merge them
          currentPeriod.end = Math.max(Number(currentPeriod.end), Number(nextPeriod.end));
        } else {
          // Non-overlapping period, push the current period and start a new one
          merged.push(currentPeriod);
          currentPeriod = nextPeriod;
        }
      }
    
      // Push the last period
      merged.push(currentPeriod);
    
      return merged;
    }


    function roundToNearestHalf(time: number) {
        const rounded = Math.round(time * 2) / 2;
        return rounded;
      };


}

