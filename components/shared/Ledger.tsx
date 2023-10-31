
interface LedgerProps{
    toggleUsingLedger: () => void,
    usingLedger: boolean
}


const Ledger = ({toggleUsingLedger, usingLedger}:LedgerProps) => {
    return (
        <div className="flex items-center mt-4">
            <span className="text-white mr-2">Ledger <span className=" font-sans">?</span></span>
            <div
                className={`shadow-lg shadow-stone-800 w-[72px] h-6 ${usingLedger ? 'bg-secondary ' : ' bg-gray-200'} rounded-full p-1 cursor-pointer ${usingLedger ? 'justify-end' : 'justify-start'
                    }`}
                onClick={toggleUsingLedger}
            >
                <div
                    className={`w-4 h-4 ${usingLedger ? 'bg-primary' : 'bg-secondary'} rounded-full transform ${usingLedger ? 'translate-x-12' : ''
                        } transition-transform duration-300`}
                ></div>
            </div>
        </div>
    )
}

export default Ledger