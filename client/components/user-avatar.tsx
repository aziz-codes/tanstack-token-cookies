 
const Avatar = ({name}:{name:string}) => {
  return (
    <div className='h-10 w-10 rounded-full border-2 p-1 border-gray-400 flex items-center justify-center uppercase bg-slate-900 text-white'>
        {name.charAt(0).concat(name.charAt(1))}
    </div>
  )
}

export default Avatar