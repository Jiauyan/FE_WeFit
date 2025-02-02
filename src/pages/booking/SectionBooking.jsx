import {
    Box,
    Button,
    Grid,
    Stack,
    Typography,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

export default function SectionBooking({ title, programs, onSeeAll }) {
    const navigate = useNavigate();

    // Handle program view navigation
    const handleView = (trainingProgram) => {
        navigate("/viewBooking", { state: { id: trainingProgram.id, slot: trainingProgram.slot, bookingId : trainingProgram.bookingId} });
    };

    // Limit programs to the first 3
    const displayedPrograms = programs.slice(0, 3);

    return (
        <Box marginY={4} marginBottom={10} marginTop={5}>
            {/* Title and "See All" Button */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h5" >
                    {title}
                </Typography>
                <Button
                    endIcon={<ArrowForwardIosIcon />}
                    onClick={onSeeAll}
                    variant="text"
                >
                    See All
                </Button>
            </Stack>
            {displayedPrograms.length === 0 ? ( // Check if there are no programs
                <Typography variant="body1" color="text.secondary" align="center">
                    Not Found.
                </Typography>
            ) : (
                <>
            {/* Program Cards in a Scrollable Grid */}
            <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="start" marginTop={3}>
                {displayedPrograms.map((program) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={program.id}>
                        <Card
                            sx={{
                                width: '100%',
                                height: '100%',
                                boxShadow: 3,
                                transition: "0.3s",
                                "&:hover": { boxShadow: 10 },
                            }}
                            onClick={() => handleView(program)}
                        >
                            <CardActionArea
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={program.downloadUrl}
                                    alt={program.title}
                                    sx={{
                                        height: 220,
                                        width: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6">
                                        {program.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {program.fitnessLevel}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            </>
            )}
        </Box>
    );
};
