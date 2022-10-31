import { useState } from 'react';
import './JntDropper.css';

/**
 * 
 * @param {object} props
 * @param {string} props.label
 * @param {boolean} props.loading
 * @param {string} props.icon
 * @param {string} props.value
 * @param {{value: string, label: string}[]} props.options
 * @param {(value: string) => void} props.onChange
 */
export default function JntDropper(props) {
    const [dropperId, setDropperId] = useState(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="jnt-dropper">
            <button
                className="hoverable-mixin"
                aria-expanded={isExpanded}
                aria-haspopup="true"
                type="button"
                tabIndex={0}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {props.icon ? (<img src={props.icon} />) : ''}
                <label htmlFor={`jnt-dropper-${dropperId}`}>
                    {props.label}
                    {props.loading ? ': ...' : `: ${props.options.find(option => option.value === props.value).label}`}
                </label>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    role="presentation"
                    aria-label="more"
                    style={{
                        '--icon-primary-color': 'currentColor',
                        '--icon-secondary-color': 'var(--ds-surface, #FFFFFF)',
                    }}>
                        <path d="M8.292 10.293a1.009 1.009 0 000 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 000-1.419.987.987 0 00-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 00-1.406 0z" fill="currentColor" fillRule="evenodd" />
                    </svg>
            </button>
            <main
                className="jnt-dropper__menu"
                aria-hidden={!isExpanded}
            >{
                props.loading ? 'Loading...' :
                !props.options.length ? 'No options' :
                props.options.map(option => (
                    <label
                        key={option.value}
                        className={
                            'hoverable-mixin ' +
                            (props.value === option.value ? 'selected' : '')
                        }
                    >
                        <input
                            type="radio"
                            name={`jnt-dropper-${dropperId}`}
                            value={option.value}
                            checked={props.value === option.value}
                            onChange={(evt) => {
                                props.onChange(evt.target.value);
                                setIsExpanded(false);
                            }}
                        />
                        {option.label}
                    </label>
                ))
            }</main>
        </div>
    );
}
