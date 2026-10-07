import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Avatar,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    CircularProgress,
    InputAdornment,
    Fade,
    Slide,
    type SelectChangeEvent
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
    Person,
    Phone,
    Send,
    CheckCircle
} from '@mui/icons-material';

import Logo from "../assets/popgarden.png"

// Zamonaviy tema yaratish
// Yangi zamonaviy tema (Dark Blue + Gold)
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#d1b83cff', // gold
            light: '#FFECB3',
            dark: '#CCAC00',
        },
        secondary: {
            main: '#002B5B', // dark blue
            light: '#30588C',
            dark: '#001F40',
        },
        background: {
            default: '#00b536ff',
            paper: 'rgba(36, 238, 124, 0.8)', // logo color with alpha
        },
        text: {
            primary: '#FFD700',
            secondary: '#FFD700',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: 'rgba(71, 77, 100, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid #cab959ff',
                    borderRadius: '20px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        '&:hover fieldset': {
                            borderColor: '#cebe68ff',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FFD700',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#FFD700',
                    },
                    '& .MuiInputBase-input': {
                        color: '#FFD700',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    padding: '12px 32px',
                    background: 'linear-gradient(45deg, #FFD700 30%, #CCAC00 90%)',
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #FFEA70 30%, #FFD700 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(255, 215, 0, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                },
            },
        },
    },
});


interface FormData {
    name: string;
    district: string;
    phoneNumber: string;
}

const SchoolRegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        district: '',
        phoneNumber: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const tumanlar = [
        'Namangan',
        'Andijon',
        "Farg`ona",
        'Toshkent',
        'Chust tumani',
        'Pop tumani',
        'Boshqa'
    ];

    // const sinflar = [
    //     '1-sinf',
    //     '2-sinf',
    //     '3-sinf',
    //     '4-sinf',
    //     '5-sinf',
    //     '6-sinf',
    //     '7-sinf',
    //     '8-sinf',
    //     '9-sinf',
    //     '10-sinf',
    //     '11-sinf'
    // ];



    const handleInputChange = (field: keyof FormData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('Ismingizni kiriting');
            return false;
        }
        if (!formData.district) {
            setError('Yashash manzilingizni kiriting');
            return false;
        }
        if (!formData.phoneNumber.trim()) {
            setError('Telefon raqamini kiriting');
            return false;
        }
        if (!/^\+998\s?\d{2}\s?\d{3}-?\d{4}$/.test(formData.phoneNumber)) {
            setError('Telefon raqami noto\'g\'ri formatda');
            return false;
        }
        return true;
    };

    const sendToTelegram = async () => {
    const message = `🎓 YANGI RO'YXATDAN O'TISH

👤 Ism: ${formData.name}
🏘️ Yashash manzili: ${formData.district}
📞 Telefon: ${formData.phoneNumber}

📅 Vaqt: ${new Date().toLocaleString('uz-UZ')}`;

        const response = await fetch('https://api.telegram.org/bot8257125308:AAFx4Yk9Gt-Sn4wCRok7rbJ2J0TnrAReC2M/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: '-1003433265887', // Bu yerga o'z chat ID'ingizni qo'ying
                text: message,
                parse_mode: 'HTML'
            }),
        });

        if (!response.ok) {
            throw new Error('Telegram ga yuborishda xatolik');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
        setError('');

        try {
            await sendToTelegram();
            setSuccess(true);
            setFormData({
                name: '',
                district: '',
                phoneNumber: '',
            });
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError('Ariza yuborishda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #068b5aff 0%, #59c99eff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                }}
            >
                <Container maxWidth="sm">
                    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        <Paper
                            elevation={24}
                            sx={{
                                padding: 4,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    // background: 'linear-gradient(90deg, #FFD700, #FFD700, #FFD700)',
                                },
                            }}
                        >
                            <Box textAlign="center" mb={4}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        margin: '0 auto 16px',
                                        // background: 'linear-gradient(45deg, #FFD700 30%, #FFD700 90%)',
                                        // boxShadow: '0 8px 32px rgba(0, 212, 255, 0.3)',
                                    }}
                                >
                                    <img style={{ width: "100px" }} src={Logo} alt="" />
                                </Avatar>

                                <Typography
                                    variant="h4"
                                    gutterBottom
                                    sx={{
                                        color: '#FFD700',
                                        fontStyle: 'normal',
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    Pop garden <strong>Yevropa standartidagi uylar</strong>
                                </Typography>

                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ color: '#FFD700', fontStyle: 'italic', textAlign: 'center' }}
                                >
                                     Ro'yxatdan o'ting
                                </Typography>

                                <Typography variant="body2" sx={{ color: '#FFD700', fontStyle: 'italic', textAlign: 'center' }}>
                                    Ma'lumotlaringizni yozib qoldiring, siz bilan tezda bog'lanamiz,
                                    POP GARDEN haqida yana ham batafsil ma'lumot beramiz
                                </Typography>
                            </Box>

                            {success ? (
                                <Fade in={success}>
                                    <Box textAlign="center" py={4}>
                                        <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
                                        <Typography variant="h5" color="#4CAF50" gutterBottom>
                                            Muvaffaqiyatli yuborildi!
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Tez orada siz bilan bog'lanamiz
                                        </Typography>
                                    </Box>
                                </Fade>
                            ) : (
                                <Box component="form" onSubmit={handleSubmit}>
                                    <TextField
                                        fullWidth
                                        label="Ismingiz"
                                        value={formData.name}
                                        onChange={handleInputChange('name')}
                                        margin="normal"
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person sx={{ color: '#FFD700' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            mb: 2,
                                            '& input:-webkit-autofill': {
                                                WebkitBoxShadow: '0 0 0 1000px rgba(0, 43, 91, 0.05) inset',
                                                WebkitTextFillColor: '#fff',
                                                transition: 'background-color 5000s ease-in-out 0s',
                                            },
                                        }}
                                    />

                                    <FormControl fullWidth margin="normal" required sx={{ mb: 2 }}>
                                        <InputLabel>Yashash manzilingizni kiriting</InputLabel>
                                        <Select
                                            value={formData.district}
                                                onChange={handleInputChange('district')}
                                                label="Yashash manzilingizni kiriting"
                                            sx={{
                                                borderRadius: '12px',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                            }}
                                        >
                                            {tumanlar.map((tuman) => (
                                                <MenuItem key={tuman} value={tuman}>
                                                    {tuman}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        fullWidth
                                        label="Telefon raqami"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange('phoneNumber')}
                                        margin="normal"
                                        required
                                        placeholder="+998 99 999-9999"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Phone sx={{ color: '#FFD700' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            mb: 3,
                                            '& input:-webkit-autofill': {
                                                WebkitBoxShadow: '0 0 0 1000px rgba(0, 43, 91, 0.05) inset',
                                                WebkitTextFillColor: '#fff',
                                                transition: 'background-color 5000s ease-in-out 0s',
                                            },
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                                        sx={{
                                            py: 1.5,
                                            fontSize: '1.2rem',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {loading ? 'Yuborilmoqda...' : 'Ariza topshirish'}
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Slide>
                </Container>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity="error"
                        variant="filled"
                        sx={{ borderRadius: '12px' }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default SchoolRegistrationForm;