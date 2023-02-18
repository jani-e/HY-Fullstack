import { useDispatch } from "react-redux"
import { filterChange } from "../reducers/filterReducer"

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
        const filterValue = event.target.value
        dispatch(filterChange(filterValue))
    }
    const filterStyle = {
        marginBottom: 10
    }
    return (
        <div style={filterStyle}>
            filter <input onChange={handleChange} />
        </div>
    )
}

export default Filter