module.exports =  function(io, User, _){
    const users = new User()
    io.on('connection',(socket)=>{
        socket.on('refresh',(data)=>{
           io.emit('refreshPage',{})
        })
        socket.on('online',(data)=>{
        socket.join(data.room)
        users.EnterRoom(socket.id,data.user,data.room)
        const list = users.GetList(data.room)
        io.emit('usersOnline', _.uniq(list))
        })
        socket.on('disconnect',()=>{
            const user = users.RemoveUser(socket.id)
            if(user){
                const obj = users.GetList(user.room)
                const arr = _.uniq(obj)
                _.remove(arr, n=> n === user.name)
                io.emit('usersOnline', arr)
            }
            })
    })
}