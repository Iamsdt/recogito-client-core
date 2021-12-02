import React, {useState} from 'react';
import {CSSTransition} from 'react-transition-group';
import {CloseIcon} from '../../../Icons';
import i18n from '../../../i18n';
import Autocomplete from '../Autocomplete';

const getDraftTag = existingDraft =>
    existingDraft ? existingDraft : {
        type: 'TextualBody', value: '', purpose: 'tagging', draft: true
    };

/** The basic freetext tag control from original Recogito **/
const TagWidget = props => {

    // All tags (draft + non-draft)
    const all = props.annotation ?
        props.annotation.bodies.filter(b => b.type === 'TextualBody' && b.purpose === 'tagging') : [];

    // Last draft tag goes into the input field
    const draftTag = getDraftTag(all.slice().reverse().find(b => b.draft));

    // All except draft tag
    const tags = all.filter(b => b != draftTag);

    const [showDelete, setShowDelete] = useState(false);

    const toggle = tag => _ => {
        if (showDelete === tag) // Removes delete button
            setShowDelete(false);
        else
            setShowDelete(tag); // Sets delete button on a different tag
    }

    const onDelete = tag => evt => {
        evt.stopPropagation();
        props.onRemoveBody(tag);
    }

    const onDraftChange = value => {
        let res = props.vocabulary.indexOf(value)
        if (res === -1) {
            return;
        }

        if (!value in props.vocabulary) {
            return
        }

        const prev = draftTag.value.trim();
        const updated = value.trim();

        if (prev.length === 0 && updated.length > 0) {
            props.onAppendBody({...draftTag, value: updated});
        } else if (prev.length > 0 && updated.length === 0) {
            props.onRemoveBody(draftTag);
        } else {
            props.onUpdateBody(draftTag, {...draftTag, value: updated});
        }
    }

    const onSubmit = tag => {
        const {draft, ...toSubmit} = tag.label ?
            {...draftTag, value: tag.label, source: tag.uri} :
            {...draftTag, value: tag};

        // if its already tagged return
        if (tags.length > 0) return;

        if (draftTag.value.trim().length === 0) {
            props.onAppendBody(toSubmit);
        } else {
            props.onUpdateBody(draftTag, toSubmit);
        }
    }

    return (
        <div className="r6o-widget r6o-tag">
            {tags.length > 0 &&
            <ul className="r6o-taglist">
                {tags.map(tag =>
                    <li key={tag.value} onClick={toggle(tag.value)}>
                        <span className="r6o-label">{tag.value}</span>

                        {!props.readOnly &&
                        <CSSTransition in={showDelete === tag.value} timeout={200} classNames="r6o-delete">
                  <span className="r6o-delete-wrapper" onClick={onDelete(tag)}>
                    <span className="r6o-delete">
                      <CloseIcon width={12}/>
                    </span>
                  </span>
                        </CSSTransition>
                        }
                    </li>
                )}
            </ul>
            }

            {!props.readOnly &&
            <Autocomplete
                focus={props.focus}
                placeholder={i18n.t('Add Labels')}
                initialValue={draftTag.value}
                onChange={onDraftChange}
                onSubmit={onSubmit}
                vocabulary={props.vocabulary || []}/>
            }
        </div>
    )

};

export default TagWidget;
