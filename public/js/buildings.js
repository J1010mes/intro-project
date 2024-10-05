

import { getdata, putdata } from "./api.js"
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js"
import { findancestorbytype } from "./dom.js"

/*
Buildings:
Each building has a Landlord who is a building,
Each bulding has rooms,
rooms can have residents who are people
*/

document.addEventListener( "DOMContentLoaded", async function() {

  document.getElementById( "addbuilding" ).addEventListener( "click", addbuildinginput )
  await gobuilding()
} )


/**
 *
 * @returns { Promise< object > }
 */
async function fetchbuildings() {
  return await getdata( "buildings" )
}

/**
 * @param { string } name
 * @param { string } postcode
 * @param { string } landlord
 * @param { string } notes
 * @param { array } rooms
 * @returns { Promise< object > }
 */
async function addbuilding( name, postcode, landlord, notes, rooms ) {
  await putdata( "buildings", { name, postcode, landlord, notes, rooms } )
}

/**
 *
 * @param { string } id
 * @param { string } name
 * @param { string } postcode
 * @param { string } landlord
 * @param { string } notes
 * @param { array } rooms
 */
async function updatebuilding( id, name, postcode, landlord, notes, rooms  ) {
  await putdata( "buildings", { id, name, postcode, landlord, notes, rooms  } )
}



/**
 * @returns { Promise }
 */
async function gobuilding() {
  const p = await fetchbuildings()
  cleartablerows( "buildingtable" )

  for( const pi in p ) {
    addbuildingdom( p[ pi ] )
  }
}

/**
 *
 */
function addbuildinginput() {

  clearform( "buldingform" )
  showform( "buildingform", async () => {

    await addbuilding( getformfieldvalue( "buildingform-name" ),
                      getformfieldvalue( "buildingform-postcode" ),
                      getformfieldvalue( "buildingform-landlord" ),
                      getformfieldvalue( "buildingform-notes" ) )
    await gobuilding()
  } )
}

/**
 *
 */
function editbuilding( ev ) {

  clearform( "buildingform" )
  const buildingrow = findancestorbytype( ev.target, "tr" )
  setformfieldvalue( "buildingform-name", buildingrow.building.name )
  setformfieldvalue( "buildingform-email", buildingrow.building.email )
  setformfieldvalue( "buildingform-notes", buildingrow.building.notes )
  showform( "buildingform", async () => {
      await updatebuilding (
                        buildingrow.building.id,
                        getformfieldvalue( "buildingform-name" ),
                        getformfieldvalue( "buildingform-email" ),
                        getformfieldvalue( "buildingform-notes" ) )
  } )

}

/**
 *
 * @param { object } building
 */
export function addbuildingdom( building ) {

  const table = gettablebody( "buildingtable" )
  const newrow = table.insertRow()

  const cells = []
  for( let i = 0; i < ( 2 + 7 ); i++ ) {
    cells.push( newrow.insertCell( i ) )
  }

  // @ts-ignore
  newrow.building = building
  cells[ 0 ].innerText = building.name

  const editbutton = document.createElement( "button" )
  editbutton.textContent = "Edit"
  editbutton.addEventListener( "click", editbuilding )

  cells[ 8 ].appendChild( editbutton )
}
