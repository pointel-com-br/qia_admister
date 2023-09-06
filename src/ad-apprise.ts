export class AdApprised {
    public message: string;
    public popup: boolean;

    constructor(message: string, popup?: boolean) {
        this.message = message;
        this.popup = popup ?? true;
    }
}

export class AdApprise {
    static CANCELED_BY_MUTATIONS = new AdApprised(
        "The user canceled this action to not loose his mutations.",
        false
    );

    static NO_RESULTS_FOUND = new AdApprised("No results found.", true);

    static INSERTED_REGISTER = new AdApprised("Inserted one register.", false);

    static UPDATED_REGISTER = new AdApprised("Updated one register.", false);

    static DELETED_REGISTER = new AdApprised("Row deleted with success.", true);
}
