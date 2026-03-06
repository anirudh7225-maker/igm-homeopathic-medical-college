import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Char "mo:core/Char";
import Nat "mo:core/Nat";

actor {
  // Timestamp
  type Timestamp = Time.Time;

  // Contact Form
  type ContactForm = {
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    timestamp : Timestamp;
  };

  // Admission Inquiry
  type AdmissionInquiry = {
    applicantName : Text;
    email : Text;
    phone : Text;
    programOfInterest : Text;
    academicBackground : Text;
    timestamp : Timestamp;
  };

  // News/Event Category
  type NewsEventCategory = {
    #news;
    #event;
  };

  // News/Event
  type NewsEvent = {
    id : Nat;
    title : Text;
    description : Text;
    date : Timestamp;
    category : NewsEventCategory;
    isActive : Bool;
  };

  // Faculty Member
  type FacultyMember = {
    id : Nat;
    name : Text;
    designation : Text;
    qualification : Text;
    department : Text;
    bio : Text;
  };

  // Program/Course
  type Program = {
    id : Nat;
    name : Text;
    duration : Text;
    description : Text;
    eligibility : Text;
    isActive : Bool;
  };

  // Internal State
  var nextNewsEventId = 1;
  var nextFacultyId = 1;
  var nextProgramId = 1;

  let contacts = List.empty<ContactForm>();
  let admissionInquiries = List.empty<AdmissionInquiry>();
  let newsEvents = Map.empty<Nat, NewsEvent>();
  let facultyMembers = Map.empty<Nat, FacultyMember>();
  let programs = Map.empty<Nat, Program>();

  // Comparison modules for custom sorting
  module NewsEvent {
    public func compareByDate(a : NewsEvent, b : NewsEvent) : Order.Order {
      Int.compare(b.date, a.date);
    };
  };

  module FacultyMember {
    public func compareByName(a : FacultyMember, b : FacultyMember) : Order.Order {
      let aName = a.name.toArray();
      let bName = b.name.toArray();
      let minLength = if (aName.size() < bName.size()) { aName.size() } else {
        bName.size();
      };

      func compareCharAtIndex(i : Nat) : ?Order.Order {
        if (i >= minLength) {
          return null;
        };
        let aChar = aName[i];
        let bChar = bName[i];
        if (aChar >= 'A' and aChar <= 'Z') {
          let lowerChar = Char.fromNat32(aChar.toNat32() + 32);
          if (lowerChar != bChar) {
            return ?Char.compare(lowerChar, bChar);
          };
        } else if (bChar >= 'A' and bChar <= 'Z') {
          let lowerChar = Char.fromNat32(bChar.toNat32() + 32);
          if (aChar != lowerChar) {
            return ?Char.compare(aChar, lowerChar);
          };
        } else if (aChar != bChar) {
          return ?Char.compare(aChar, bChar);
        };
        compareCharAtIndex(i + 1);
      };

      switch (compareCharAtIndex(0)) {
        case (?order) { order };
        case (null) { Nat.compare(aName.size(), bName.size()) };
      };
    };
  };

  // Public Functions

  // Submit Contact Form
  public shared ({ caller }) func submitContactForm(name : Text, email : Text, phone : Text, message : Text) : async () {
    let contact : ContactForm = {
      name;
      email;
      phone;
      message;
      timestamp = Time.now();
    };
    contacts.add(contact);
  };

  // Submit Admission Inquiry
  public shared ({ caller }) func submitAdmissionInquiry(applicantName : Text, email : Text, phone : Text, programOfInterest : Text, academicBackground : Text) : async () {
    let inquiry : AdmissionInquiry = {
      applicantName;
      email;
      phone;
      programOfInterest;
      academicBackground;
      timestamp = Time.now();
    };
    admissionInquiries.add(inquiry);
  };

  // Add News/Event
  public shared ({ caller }) func addNewsEvent(title : Text, description : Text, category : NewsEventCategory, isActive : Bool) : async () {
    let newsEvent : NewsEvent = {
      id = nextNewsEventId;
      title;
      description;
      date = Time.now();
      category;
      isActive;
    };
    newsEvents.add(nextNewsEventId, newsEvent);
    nextNewsEventId += 1;
  };

  // Update News/Event
  public shared ({ caller }) func updateNewsEvent(id : Nat, title : Text, description : Text, category : NewsEventCategory, isActive : Bool) : async () {
    switch (newsEvents.get(id)) {
      case (?existing) {
        let updated : NewsEvent = {
          id;
          title;
          description;
          date = Time.now();
          category;
          isActive;
        };
        newsEvents.add(id, updated);
      };
      case (null) { Runtime.trap("News/Event not found") };
    };
  };

  // Remove News/Event
  public shared ({ caller }) func removeNewsEvent(id : Nat) : async () {
    if (not newsEvents.containsKey(id)) {
      Runtime.trap("News/Event not found");
    };
    newsEvents.remove(id);
  };

  // Add Faculty Member
  public shared ({ caller }) func addFacultyMember(name : Text, designation : Text, qualification : Text, department : Text, bio : Text) : async () {
    let faculty : FacultyMember = {
      id = nextFacultyId;
      name;
      designation;
      qualification;
      department;
      bio;
    };
    facultyMembers.add(nextFacultyId, faculty);
    nextFacultyId += 1;
  };

  // Update Faculty Member
  public shared ({ caller }) func updateFacultyMember(id : Nat, name : Text, designation : Text, qualification : Text, department : Text, bio : Text) : async () {
    switch (facultyMembers.get(id)) {
      case (?existing) {
        let updated : FacultyMember = {
          id;
          name;
          designation;
          qualification;
          department;
          bio;
        };
        facultyMembers.add(id, updated);
      };
      case (null) { Runtime.trap("Faculty member not found") };
    };
  };

  // Remove Faculty Member
  public shared ({ caller }) func removeFacultyMember(id : Nat) : async () {
    if (not facultyMembers.containsKey(id)) {
      Runtime.trap("Faculty member not found");
    };
    facultyMembers.remove(id);
  };

  // Add Program
  public shared ({ caller }) func addProgram(name : Text, duration : Text, description : Text, eligibility : Text, isActive : Bool) : async () {
    let program : Program = {
      id = nextProgramId;
      name;
      duration;
      description;
      eligibility;
      isActive;
    };
    programs.add(nextProgramId, program);
    nextProgramId += 1;
  };

  // Update Program
  public shared ({ caller }) func updateProgram(id : Nat, name : Text, duration : Text, description : Text, eligibility : Text, isActive : Bool) : async () {
    switch (programs.get(id)) {
      case (?existing) {
        let updated : Program = {
          id;
          name;
          duration;
          description;
          eligibility;
          isActive;
        };
        programs.add(id, updated);
      };
      case (null) { Runtime.trap("Program not found") };
    };
  };

  // Remove Program
  public shared ({ caller }) func removeProgram(id : Nat) : async () {
    if (not programs.containsKey(id)) {
      Runtime.trap("Program not found");
    };
    programs.remove(id);
  };

  // Get Active News/Events sorted by date
  public query ({ caller }) func getActiveNewsEvents() : async [NewsEvent] {
    let filtered = newsEvents.values().toArray().filter(
      func(event) { event.isActive }
    );

    filtered.sort(
      NewsEvent.compareByDate
    );
  };

  // Get All Faculty Members sorted by name
  public query ({ caller }) func getAllFacultyMembers() : async [FacultyMember] {
    facultyMembers.values().toArray().sort(FacultyMember.compareByName);
  };

  // Get Active Programs
  public query ({ caller }) func getActivePrograms() : async [Program] {
    let filtered = programs.values().toArray().filter(
      func(program) { program.isActive }
    );
    let filteredSize = filtered.size();
    if (filteredSize <= 1) {
      return filtered;
    };
    filtered;
  };

  // Get All Programs
  public query ({ caller }) func getAllPrograms() : async [Program] {
    programs.values().toArray();
  };

  // Get All News/Events
  public query ({ caller }) func getAllNewsEvents() : async [NewsEvent] {
    newsEvents.values().toArray();
  };

  // Get Specific Program
  public query ({ caller }) func getProgram(id : Nat) : async Program {
    switch (programs.get(id)) {
      case (?program) { program };
      case (null) { Runtime.trap("Program not found") };
    };
  };

  // Get Specific News/Event
  public query ({ caller }) func getNewsEvent(id : Nat) : async NewsEvent {
    switch (newsEvents.get(id)) {
      case (?event) { event };
      case (null) { Runtime.trap("News/Event not found") };
    };
  };

  // Get Specific Faculty Member
  public query ({ caller }) func getFacultyMember(id : Nat) : async FacultyMember {
    switch (facultyMembers.get(id)) {
      case (?faculty) { faculty };
      case (null) { Runtime.trap("Faculty member not found") };
    };
  };
};
