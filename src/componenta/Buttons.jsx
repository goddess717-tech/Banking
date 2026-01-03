import { ArrowLeftRight, DollarSign, Plus } from 'lucide-react'
import React from 'react'

const Buttons = () => {
  return (
    <>
    <style>
        {`
        .right-quick-actions {
          display: flex;
          gap: 16px;
        }
        .right-quick-actions .action-btn {
          display: flex;
          align-items: center;
        }
        .right-quick-actions .action-btn svg {
          margin-right: 8px;
        }
        .right-quick-actions .action-btn-secondary {
          background-color: #e0e7ff;
          color: #3730a3;
        }
          `}
    </style>
    <div className="right-quick-actions">
            <button className="action-btn">
              <Plus size={18} strokeWidth={2.5} />
              New Transfer
            </button>
            
            <button className="action-btn action-btn-secondary">
              <DollarSign size={18} strokeWidth={2.5} />
              Pay Bill
            </button>
          </div>
    </>

  )
}

export default Buttons