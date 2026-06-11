<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nouveau message de contact</title>
    </head>
    <body
        style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
            font-family: Manrope, Arial, sans-serif;
        "
    >
        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="padding: 40px 20px"
        >
            <tr>
                <td align="center">
                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                            background-color: #ffffff;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                        "
                    >
                        <!-- Header -->
                        <tr>
                            <td
                                style="
                                    background: linear-gradient(
                                        135deg,
                                        #ff8c42,
                                        #ff6b4a
                                    );
                                    padding: 40px;
                                    text-align: center;
                                "
                            >
                                <h1
                                    style="
                                        margin: 0;
                                        color: #ffffff;
                                        font-size: 28px;
                                        font-weight: 800;
                                    "
                                >
                                    🚴 {{ config("app.name") }}
                                </h1>
                                <p
                                    style="
                                        margin: 8px 0 0;
                                        color: rgba(255, 255, 255, 0.85);
                                        font-size: 14px;
                                    "
                                >
                                    Nouveau message de {{ $name }}
                                </p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px">
                                <p
                                    style="
                                        margin: 0 0 24px;
                                        color: #71717a;
                                        font-size: 15px;
                                    "
                                >
                                    Vous avez reçu un nouveau message via le
                                    formulaire de contact.
                                </p>

                                <!-- Name -->
                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="margin-bottom: 16px"
                                >
                                    <tr>
                                        <td
                                            style="
                                                background-color: #f4f4f5;
                                                border-radius: 10px;
                                                padding: 16px 20px;
                                            "
                                        >
                                            <p
                                                style="
                                                    margin: 0 0 4px;
                                                    font-size: 11px;
                                                    font-weight: 700;
                                                    color: #a1a1aa;
                                                    text-transform: uppercase;
                                                    letter-spacing: 1px;
                                                "
                                            >
                                                Nom
                                            </p>
                                            <p
                                                style="
                                                    margin: 0;
                                                    font-size: 15px;
                                                    color: #18181b;
                                                    font-weight: 600;
                                                "
                                            >
                                                {{ $name }}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Email -->
                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="margin-bottom: 16px"
                                >
                                    <tr>
                                        <td
                                            style="
                                                background-color: #f4f4f5;
                                                border-radius: 10px;
                                                padding: 16px 20px;
                                            "
                                        >
                                            <p
                                                style="
                                                    margin: 0 0 4px;
                                                    font-size: 11px;
                                                    font-weight: 700;
                                                    color: #a1a1aa;
                                                    text-transform: uppercase;
                                                    letter-spacing: 1px;
                                                "
                                            >
                                                Email
                                            </p>
                                            <p
                                                style="
                                                    margin: 0;
                                                    font-size: 15px;
                                                    color: #18181b;
                                                    font-weight: 600;
                                                "
                                            >
                                                <a
                                                    href="mailto:{{ $email }}"
                                                    style="
                                                        color: #ff8c42;
                                                        text-decoration: none;
                                                    "
                                                    >{{ $email }}</a
                                                >
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Subject -->
                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="margin-bottom: 16px"
                                >
                                    <tr>
                                        <td
                                            style="
                                                background-color: #f4f4f5;
                                                border-radius: 10px;
                                                padding: 16px 20px;
                                            "
                                        >
                                            <p
                                                style="
                                                    margin: 0 0 4px;
                                                    font-size: 11px;
                                                    font-weight: 700;
                                                    color: #a1a1aa;
                                                    text-transform: uppercase;
                                                    letter-spacing: 1px;
                                                "
                                            >
                                                Sujet
                                            </p>
                                            <p
                                                style="
                                                    margin: 0;
                                                    font-size: 15px;
                                                    color: #18181b;
                                                    font-weight: 600;
                                                    text-transform: capitalize;
                                                "
                                            >
                                                {{ $subject }}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Message -->
                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="margin-bottom: 32px"
                                >
                                    <tr>
                                        <td
                                            style="
                                                background-color: #fff7ed;
                                                border-left: 4px solid #ff8c42;
                                                border-radius: 0 10px 10px 0;
                                                padding: 20px;
                                            "
                                        >
                                            <p
                                                style="
                                                    margin: 0 0 8px;
                                                    font-size: 11px;
                                                    font-weight: 700;
                                                    color: #a1a1aa;
                                                    text-transform: uppercase;
                                                    letter-spacing: 1px;
                                                "
                                            >
                                                Message
                                            </p>
                                            <p
                                                style="
                                                    margin: 0;
                                                    font-size: 15px;
                                                    color: #18181b;
                                                    line-height: 1.6;
                                                "
                                            >
                                                {{ $messages }}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Reply Button -->
                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                >
                                    <tr>
                                        <td align="center">
                                            <a
                                                href="mailto:{{ $email }}"
                                                style="
                                                    display: inline-block;
                                                    background: linear-gradient(
                                                        135deg,
                                                        #ff8c42,
                                                        #ff6b4a
                                                    );
                                                    color: #ffffff;
                                                    text-decoration: none;
                                                    padding: 14px 32px;
                                                    border-radius: 50px;
                                                    font-weight: 700;
                                                    font-size: 14px;
                                                "
                                            >
                                                ✉️ Répondre à {{ $name }}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td
                                style="
                                    background-color: #f4f4f5;
                                    padding: 24px 40px;
                                    text-align: center;
                                    border-top: 1px solid #e4e4e7;
                                "
                            >
                                <p
                                    style="
                                        margin: 0;
                                        font-size: 12px;
                                        color: #a1a1aa;
                                    "
                                >
                                    © 2024 BikeApp — Ce message a été envoyé
                                    depuis le formulaire de contact.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
