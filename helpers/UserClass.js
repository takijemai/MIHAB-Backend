
class User {
    constructor(){
        this.GlobalArray = []
    }
  EnterRoom(id,name,room){
    const user = {id,name,room}
    this.GlobalArray.push(user)
    return user
  }
  GetUserId(id){
    const socketID = this.GlobalArray.filter(userId=> userId.id === id)
  }
  RemoveUser(id){
    const user = this.GetUserId(id)
if(user){
    this.GlobalArray= this.GlobalArray.filter(userId=> userId.id !== id)
}
return user
  }
 GetList(room){
    const roomname = this.GlobalArray.filter(user => user.room === room)
    const names= roomname.map(user=> user.name)
    return names
 } 
}
module.exports = {  User}