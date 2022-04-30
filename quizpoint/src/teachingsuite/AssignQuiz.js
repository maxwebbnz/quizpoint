/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList() {
    let quizLeft = [
        {
            name: "Quiz 1",
            code: "QUIZ_-N0mz6NlfZeKqS5CnxLfa"
        },
        {
            name: "Quiz 1",
            code: "QUIZ_-N0mz6NlfZeKqS5CnxLfc"
        },
        {
            name: "Quiz 1",
            code: "QUIZ_-N0mz6NlfZeKqS5CnxLfd"
        },
        {
            name: "Quiz 1",
            code: "QUIZ_-N0mz6NlfZeKqS5CnxLfe"
        },
        {
            name: "Quiz 1",
            code: "QUIZ_-N0mz6NlfZeKqS5CnxLff"
        },
        {
            name: "Quiz 1",
            code: "QUIZ_-N0mz6NlfZeKqS5CnxLaf"
        },
    ]
    let quizRight = [
        {
            name: "Quiz 2A",
            code: "QUIZ_-N0mz6NlfZeKqSfCnxLf"
        },
        {
            name: "Quiz 3A",
            code: "QUIZ_-N0mz6NlfZeKqS5CgnxLf"
        },
        {
            name: "Quiz 4A",
            code: "QUIZ_-N0mz6NlfZeKqS5CanxLf"
        },
        {
            name: "Quiz 5A",
            code: "QUIZ_-N0mz6NlfZeKqS5CvnxLf"
        },
        {
            name: "Quiz 6A",
            code: "QUIZ_-N0mza6NlfZeKqS5CnxLf"
        },
        {
            name: "Quiz 7A",
            code: "QUIZ_-N0vmz6NlfZeKqS5CnxLf"
        },
    ]
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(quizLeft);
    const [right, setRight] = React.useState(quizRight);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const customList = (items) => (
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem
                            key={value.code}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value.name}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );

    return (
        <div>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>{customList(left)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                        >
                            ≫
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList(right)}</Grid>
            </Grid>
            <button>Assign Quizzes</button>

        </div>
    );
}