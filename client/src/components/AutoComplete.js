import { Input } from "@chakra-ui/react";
import React, { useState } from "react";
import './AutoComplete.css'

export default function AutoComplete(props) {
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userInput, setUserInput] = useState('');

    const onChange = e => {
        const { suggestions } = props;
        const userInput = e.currentTarget.value;

        setFilteredSuggestions(suggestions.filter(
            suggestion =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        ));

        setActiveSuggestion(0);
        setShowSuggestions(true);
        setUserInput(e.currentTarget.value);
        props.name.current = e.currentTarget.value;
    };

    const onClick = e => {
        setActiveSuggestion(0);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setUserInput(e.currentTarget.innerText);
        props.name.current = e.currentTarget.innerText;
    };

    const onKeyDown = e => {
        if (e.keyCode === 13) {
            setActiveSuggestion(0);
            setShowSuggestions(false);
            setUserInput(filteredSuggestions[activeSuggestion]);
            props.name.current = filteredSuggestions[activeSuggestion];
        } else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }
            setActiveSuggestion(activeSuggestion - 1);
        }
        // User pressed the down arrow, increment the index
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }
            setActiveSuggestion(activeSuggestion + 1);
        }
    }

    const SuggestionsListComponent = (props) => {
        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                return (
                    <ul className="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }
                            return (
                                <li className={className} key={suggestion} onClick={onClick}>
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                return (
                    <div className="no-suggestions">
                        <em>No suggestions available.</em>
                    </div>
                );
            }
        }
    }

    return (
        <>
            <Input
                type="text"
                ref={props.initialRef}
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={userInput}
                autoComplete='off'
                placeholder={props.placeholder}
            />
            <SuggestionsListComponent></SuggestionsListComponent>
        </>
    )
};